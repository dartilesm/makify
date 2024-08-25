import { cn } from "@makify/ui/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("flex w-full justify-center", className)}>
      <div className={"w-full max-w-screen-lg"}>{children}</div>
    </div>
  );
}
