import { Button, Input } from "@makify/ui";
import { PdfPagination } from "./pdf-pagination";
import { PdfData } from "@/components/pdf/pdf-viewer";
import { ArrowLeftIcon, ArrowRightIcon, ZoomInIcon, ZoomOutIcon, DotsVerticalIcon } from "@radix-ui/react-icons"

export function PdfToolbar({ className, pdfData }: { className?: string, pdfData: PdfData }) {
    return <div className="border-t bg-gray-50 px-4 py-1 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center justify-between">
            {/* Page controller */}
            <div className="flex items-center gap-2">
                <Button className="rounded-full" size="icon" variant="ghost">
                    <ArrowLeftIcon className="h-5 w-5" />
                </Button>
                <Input className="w-8 h-6" value={1} />
                <Button className="rounded-full" size="icon" variant="ghost">
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
                <span className="text-sm">Page 1 of 3</span>
                {/* <Separator className="h-6" orientation="vertical" /> */}
                <Button className="rounded-full" size="icon" variant="ghost">
                    <DotsVerticalIcon className="h-5 w-5" />
                </Button>
            </div>
        </div>
    </div>
}