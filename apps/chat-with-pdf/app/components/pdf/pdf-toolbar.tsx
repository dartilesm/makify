import { Button, Input } from "@makify/ui";
import { PdfData } from "@/components/pdf/pdf-viewer";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ZoomInIcon,
  ZoomOutIcon,
  DotsVerticalIcon,
} from "@radix-ui/react-icons";
import { useRef } from "react";
import { cn } from "@makify/ui/lib/utils";

type Props = {
  className?: string;
  pdfData: PdfData;
  page: number;
  onPageChange?: (page: number) => void;
};

export function PdfToolbar({
  className,
  pdfData,
  page,
  onPageChange = () => null,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > pdfData.numPages) return;
    onPageChange(newPage);
    inputRef.current!.value = newPage.toString();
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
          <Button className="rounded-full" size="icon" variant="ghost">
            <ZoomInIcon className="h-5 w-5" />
          </Button>
          <Button className="rounded-full" size="icon" variant="ghost">
            <ZoomOutIcon className="h-5 w-5" />
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
