import { cn } from "@makify/ui/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn(
        "flex max-w-[100px] flex-shrink-0 flex-col gap-1 text-sm leading-none",
        className,
      )}
    >
      Chat with PDF
      <span className="text-muted-foreground text-right text-[8px] leading-none">
        by Makify ✨
      </span>
    </div>
  );
}
