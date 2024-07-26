import { Button, Input } from "@makify/ui";
import { PAGE_ZOOM_TYPE, PdfData } from "@/components/pdf/pdf-viewer";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ZoomInIcon,
  ZoomOutIcon,
  DotsVerticalIcon,
} from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import { cn } from "@makify/ui/lib/utils";

type Props = {
  className?: string;
  pdfData: PdfData;
  page: number;
  zoom?: number;
  onPageChange?: (page: number) => void;
  onZoomChange?: (zoomType: PAGE_ZOOM_TYPE) => void;
};

export function PdfToolbar({
  className,
  pdfData,
  page,
  zoom = 1,
  onPageChange = () => null,
  onZoomChange = (zoomScale: number) => null,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > pdfData.numPages) return;
    onPageChange(newPage);
    inputRef.current!.value = newPage.toString();
  }

  function handlePageZoom(zoomType: PAGE_ZOOM_TYPE) {
    onZoomChange(zoomType);
  }

  return (
    <div className={cn("border-b-[1px] border-gray-100 p-2", className)}>
      <div className="flex items-center justify-between">
        {/* Page pagination */}
        <div className="flex items-center gap-2">
          <Button
            className="rounded-full"
            size="icon"
            variant="ghost"
            onClick={() => handlePageChange(page - 1)}
            disabled={page - 1 < 1}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <Input
            ref={inputRef}
            className="h-6 w-16 appearance-none p-0 text-center"
            defaultValue={page}
            type="number"
            min={1}
            max={pdfData.numPages}
            onChange={(event) => handlePageChange(+event.target.value)}
          />
          <Button
            className="rounded-full"
            size="icon"
            variant="ghost"
            onClick={() => handlePageChange(page + 1)}
            disabled={page + 1 > pdfData.numPages}
          >
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
          {/* <Separator className="h-6" orientation="vertical" /> */}
          <Button
            className="rounded-full"
            size="icon"
            variant="ghost"
            disabled={zoom === 0.25}
            onClick={() => handlePageZoom(PAGE_ZOOM_TYPE.OUT)}
          >
            <ZoomOutIcon className="h-5 w-5" />
          </Button>
          <Button
            className="rounded-full"
            size="icon"
            variant="ghost"
            disabled={zoom === 2}
            onClick={() => handlePageZoom(PAGE_ZOOM_TYPE.IN)}
          >
            <ZoomInIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            Page {page} of {pdfData.numPages}
          </span>
          {/* <Separator className="h-6" orientation="vertical" /> */}
          <Button className="rounded-full" size="icon" variant="ghost">
            <DotsVerticalIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
