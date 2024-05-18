import { Button, Input, Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon, ZoomInIcon, ZoomOutIcon, DotsVerticalIcon } from "@radix-ui/react-icons"

export function PdfPagination({ className, pages, page }: { className?: string, pages: number, page: number }) {
    return <div className="flex items-center gap-2">
        <Button className="rounded-full" size="icon" variant="ghost">
            <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <Input className="w-8 h-6" value={page} />
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
}