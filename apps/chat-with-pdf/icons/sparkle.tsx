import { cn } from "@makify/ui/lib/utils";
import { forwardRef } from "react";

type SparkleIconProps = {
  className?: string;
};

export const SparkleIcon = forwardRef<SVGSVGElement, SparkleIconProps>(
  function SparkleIcon({ className }: SparkleIconProps, ref) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        version="1"
        viewBox="0 0 300 299"
        className={cn("h-4 w-4", className)}
      >
        <path
          d="M1450 2974c-48-20-58-36-154-246-46-101-112-244-146-318-35-74-89-191-120-260l-57-125-462-215C7 1575 10 1577 10 1494c0-60 28-89 139-141 129-61 339-158 546-252 94-43 194-90 223-105 61-31 37 12 269-491 206-448 209-453 245-475 42-25 84-25 126 0 38 23 22-8 322 640 39 85 88 190 107 233 20 42 40 77 44 77s75 31 156 69 281 130 443 205c327 151 350 167 350 239 0 23-8 55-19 72-19 31-59 52-596 298-82 37-193 89-246 114l-97 45-50 107c-49 103-130 277-254 546-121 262-128 274-156 289-45 22-75 25-112 10z"
          transform="matrix(.1 0 0 -.1 0 299)"
        />
      </svg>
    );
  },
);
