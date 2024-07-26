"use client";

import { Skeleton } from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { useContext, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { DocumentCallback } from "react-pdf/dist/cjs/shared/types";
import { PdfToolbar } from "./pdf-toolbar";
import { ChatContext } from "@/app/context/chat-context";
import { updateChatMessages } from "@/app/actions/update-chat-messages";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export type PdfData = {
  numPages: number;
  title: string;
};

export function PdfViewer({ className }: { className?: string }) {
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [pdfContainerWidth, setPdfContainerWidth] = useState<number>(0);
  const [pdfData, setPdfData] = useState<PdfData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { chatData } = useContext(ChatContext);

  function updatePdfContainerWidth() {
    if (pdfContainerRef.current) {
      const horizontalPadding = 16 * 2;
      setPdfContainerWidth(
        pdfContainerRef.current.offsetWidth - horizontalPadding,
      );
    }
  }

  async function handlePdfData(pdf: DocumentCallback) {
    const { numPages } = pdf;
    const { info } = await pdf.getMetadata();
    const title = info?.Title ?? "Untitled PDF";
    const pdfData = {
      numPages,
      title,
    };

    if (!chatData.documentMetadata) {
      updateChatMessages({
        documentId: chatData.id as string,
        documentMetadata: pdfData,
      });
    }

    setPdfData(pdfData);
  }

  return (
    <div className={cn("w-full lg:block", className)}>
      <div className="dark:bg-primary-foreground relative flex h-full flex-col overflow-hidden border-l-2 border-gray-100 bg-white">
        {/* <header className="flex h-[60px] items-center justify-between border-b px-6 dark:border-gray-800">
          <div className="w-full">
            {pdfData ? (
              <>
                <h3 className="text-sm font-medium">{pdfData?.title}</h3>
                {pdfData ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {pdfData?.numPages} page{pdfData?.numPages > 1 ? "s" : ""} -
                    352 words
                  </p>
                ) : null}
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-[15px] w-[30%] rounded-full" />
                <Skeleton className="h-[15px] w-[100px] rounded-full" />
              </div>
            )}
          </div>
        </header> */}
        {pdfData && (
          <PdfToolbar
            pdfData={pdfData}
            onPageChange={setCurrentPage}
            page={currentPage}
          />
        )}
        <div className="flex-1 overflow-auto p-4" ref={pdfContainerRef}>
          <div className="relative grid h-full gap-4">
            {!pdfData && (
              <Skeleton className="absolute left-0 top-0 block h-full w-full" />
            )}
            <Document
              file={chatData.documentUrl}
              onSourceSuccess={updatePdfContainerWidth}
              onLoadSuccess={handlePdfData}
              loading={null}
            >
              <Page pageNumber={currentPage} width={pdfContainerWidth} />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
}
