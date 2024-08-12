"use client";

import { updateChatMessages } from "@/app/actions/update-chat-messages";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverPortal,
  Skeleton,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { MessageSquareQuoteIcon } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { type DocumentCallback } from "react-pdf/dist/cjs/shared/types";
import { useOnClickOutside } from "usehooks-ts";
import { useGlobalChat } from "hooks/use-global-chat";
import { PdfToolbar } from "./pdf-toolbar";

pdfjs.GlobalWorkerOptions.workerSrc = `/api/pdf-helper?url=unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const documentOptions = {
  cMapUrl: `/api/pdf-helper?url=unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
};

export const enum PAGE_ZOOM_TYPE {
  IN,
  OUT,
}

interface SelectedTextOptions {
  selectedText: string;
  coordinates: {
    top: number;
    left: number;
  };
}

export interface PdfData {
  numPages: number;
  title: string;
}

export function PdfViewer({ className }: { className?: string }) {
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pdfPagesRef = useRef<HTMLDivElement[] | null[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pdfData, setPdfData] = useState<PdfData | null>(null);
  const {
    globalContext: { chatData, setExtraData },
  } = useGlobalChat();
  useOnClickOutside(popoverRef, () => { setSelectedTextOptions(null); });
  /* Tools */
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  const [enableChangePageOnScroll, setEnableChangePageOnScroll] =
    useState<boolean>(true);

  /* PDF actions */
  const [selectedTextOptions, setSelectedTextOptions] =
    useState<SelectedTextOptions | null>(null);

  async function handlePdfData(pdf: DocumentCallback) {
    const pdfBytes = await pdf.getData();

    const pdfDoc = await PDFDocument.load(pdfBytes, { updateMetadata: false });

    const title = pdfDoc.getTitle() ?? "Untitled PDF";
    const numPages = pdfDoc.getPageCount();

    const documentMetadata = {
      title,
      numPages,
    };

    if (!chatData.documentMetadata) {
      updateChatMessages({
        documentId: chatData.id!,
        documentMetadata,
      });
    }

    setPdfData(documentMetadata);
  }

  function handlePdfScroll(event: WheelEvent) {
    const isControlPressed = event.ctrlKey;

    const scrollDirection = event.deltaY > 0 ? "down" : "up";

    if (isControlPressed) {
      handlePageZoomChange(
        scrollDirection === "down" ? PAGE_ZOOM_TYPE.OUT : PAGE_ZOOM_TYPE.IN,
      );
      return;
    }

    if (!enableChangePageOnScroll) return;

    const pdfContainerEl = pdfContainerRef.current;

    let isScrollAtBottom;

    if (pdfContainerEl)
      isScrollAtBottom =
        Math.abs(
          pdfContainerEl.scrollHeight -
            (pdfContainerEl.scrollTop + pdfContainerEl.clientHeight),
        ) <= 1;

    const isScrollAtTop = pdfContainerEl?.scrollTop === 0;

    const canGoNextPage = scrollDirection === "down" && isScrollAtBottom;
    const canGoPrevPage = scrollDirection === "up" && isScrollAtTop;

    if (canGoNextPage || canGoPrevPage) {
      const safeNextPage = Math.min(
        pdfData?.numPages!,
        Math.max(1, currentPage + (scrollDirection === "down" ? 1 : -1)),
      );
      setCurrentPage(safeNextPage);
    }

    return null;
  }

  function handlePageNumberChange(pageNumber: number) {
    setCurrentPage(pageNumber);
    pdfPagesRef.current[pageNumber - 1]?.scrollIntoView();
  }

  function handlePageZoomChange(zoomType: PAGE_ZOOM_TYPE) {
    const zoom =
      zoomType === PAGE_ZOOM_TYPE.IN ? currentZoom + 0.25 : currentZoom - 0.25;
    const limitedZoom = Math.min(2, Math.max(0.25, zoom));

    setCurrentZoom(limitedZoom);
  }

  function handleTextSelection() {
    const selection = window.getSelection();
    // Get the selected text
    const selectedText = selection?.toString();

    // Get selection coordinates
    const range = selection?.getRangeAt(0);
    const rect = range?.getBoundingClientRect();

    const textOptions = selectedText
      ? {
          selectedText,
          coordinates: {
            top: (rect?.top!) - 50,
            left: rect?.left!,
          },
        }
      : null;

    setSelectedTextOptions(textOptions);
  }

  function handleAskAssistant() {
    // remove text selection
    window.getSelection()?.removeAllRanges();
    // close popover
    setSelectedTextOptions(null);
    setExtraData({
      quotedText: selectedTextOptions?.selectedText,
      page: currentPage,
    });
  }

  return (
    <div className={cn("h-full w-full lg:block", className)}>
      <div className="flex h-full flex-col overflow-hidden">
        <PdfToolbar
          pdfData={pdfData!}
          zoom={currentZoom}
          page={currentPage}
          changePageOnScroll={enableChangePageOnScroll}
          onPageChange={handlePageNumberChange}
          onZoomChange={handlePageZoomChange}
          onChangePageOnScroll={setEnableChangePageOnScroll}
        />
        <div className="flex-1 overflow-auto p-4" ref={pdfContainerRef}>
          <div className="relative flex h-full gap-4">
            {!pdfData && (
              <Skeleton className="absolute left-0 top-0 block h-full w-full" />
            )}

            {chatData.documentUrl ? <Document
                options={documentOptions}
                file={`/api/pdf-helper?url=${chatData.documentUrl}`}
                onLoadSuccess={handlePdfData}
                onWheel={handlePdfScroll}
                loading={null}
                noData={null}
                error={null}
                className="flex w-full flex-col items-center gap-4"
              >
                <Popover open={Boolean(selectedTextOptions)}>
                  <Page
                    pageNumber={currentPage}
                    className="border-border max-w-max border shadow-lg"
                    scale={currentZoom}
                    onMouseUp={handleTextSelection}
                  />
                  <PopoverPortal>
                    <PopoverContent
                      className="absolute z-20 w-fit p-1"
                      onOpenAutoFocus={(e) => { e.preventDefault(); }}
                      style={{ ...(selectedTextOptions?.coordinates || {}) }}
                      ref={popoverRef}
                    >
                      <Button
                        className="z-30 flex gap-2"
                        variant="ghost"
                        size="sm"
                        onClick={handleAskAssistant}
                      >
                        <MessageSquareQuoteIcon className="h-4 w-4" />
                        Ask the assistant
                      </Button>
                    </PopoverContent>
                  </PopoverPortal>
                </Popover>
              </Document> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
