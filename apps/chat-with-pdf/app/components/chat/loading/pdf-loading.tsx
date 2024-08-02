import { Skeleton } from "@makify/ui";

export function PDFLoading() {
  return (
    <div className="dark:bg-primary-foreground relative flex h-full flex-col bg-white">
      <div className="flex h-[53px] items-center border-b-[1px] border-gray-100 p-2" />
      <div className="flex h-full w-full p-4">
        <Skeleton className="h-full w-full flex-1 " />
      </div>
    </div>
  );
}
