import { PAGE_ZOOM_TYPE, PdfData } from "@/components/pdf/pdf-viewer";
import {
  Button,
  Input,
  Toggle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@radix-ui/react-icons";
import { UnfoldVerticalIcon } from "lucide-react";

type Props = {
  className?: string;
  pdfData: PdfData;
  page: number;
  zoom?: number;
  changePageOnScroll?: boolean;
  onPageChange?: (page: number) => void;
  onZoomChange?: (zoomType: PAGE_ZOOM_TYPE) => void;
  onChangePageOnScroll?: (enabled: boolean) => void;
};

export function PdfToolbar({
  className,
  pdfData,
  page,
  zoom = 1,
  changePageOnScroll = false,
  onPageChange = () => null,
  onZoomChange = (zoomScale: number) => null,
  onChangePageOnScroll = () => null,
}: Props) {
  const zoomFormatted = `${zoom * 100}%`;

  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > pdfData?.numPages) return;
    onPageChange(newPage);
  }

  function handlePageZoom(zoomType: PAGE_ZOOM_TYPE) {
    onZoomChange(zoomType);
  }

  return (
    <div className={cn("border-b-[1px] border-gray-100 p-2", className)}>
      <div className="flex items-center justify-between">
        <TooltipProvider delayDuration={0}>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="flex-shrink-0"
                  size="icon"
                  variant="ghost"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page - 1 < 1}
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Previous page</TooltipContent>
            </Tooltip>
            <div className="text-muted-foreground flex flex-row items-center gap-2">
              <Input
                className="h-8 w-16 appearance-none p-0 text-center"
                value={page}
                type="number"
                min={1}
                max={pdfData?.numPages || 1}
                disabled={!pdfData}
                onChange={(event) => handlePageChange(+event.target.value)}
              />
              <span>of {pdfData?.numPages || 1}</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="flex-shrink-0"
                  size="icon"
                  variant="ghost"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page + 1 > pdfData?.numPages}
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Next page</TooltipContent>
            </Tooltip>
            {/* <Separator className="h-6" orientation="vertical" /> */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="flex-shrink-0"
                  size="icon"
                  variant="ghost"
                  disabled={zoom === 0.25 || !pdfData}
                  onClick={() => handlePageZoom(PAGE_ZOOM_TYPE.OUT)}
                >
                  <ZoomOutIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Zoom Out</TooltipContent>
            </Tooltip>
            <span className="text-muted-foreground">{zoomFormatted}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="flex-shrink-0"
                  size="icon"
                  variant="ghost"
                  disabled={zoom === 2 || !pdfData}
                  onClick={() => handlePageZoom(PAGE_ZOOM_TYPE.IN)}
                >
                  <ZoomInIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Zoom In</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  className="hover:text-primary flex-shrink-0"
                  onPressedChange={onChangePageOnScroll}
                  pressed={changePageOnScroll}
                  disabled={!pdfData}
                >
                  <UnfoldVerticalIcon className="h-5 w-5" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Change page on scroll
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
