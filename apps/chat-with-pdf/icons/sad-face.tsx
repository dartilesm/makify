import { cn } from "@makify/ui/lib/utils";
import { forwardRef } from "react";

type SadFaceIconProps = {
  className?: string;
};

export const SadFaceIcon = forwardRef<SVGSVGElement, SadFaceIconProps>(
  function SadFaceIcon({ className }: SadFaceIconProps, ref) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width="206.667"
        height="192"
        version="1"
        viewBox="0 0 155 144"
        className={cn("h-4 w-4", className)}
      >
        <path
          d="M252 1309c-84-42-118-155-71-238 69-124 251-117 310 13 24 52 23 90 0 142-42 91-149 129-239 83zM1132 1313c-131-64-132-244-2-311 155-80 314 93 225 244-43 74-147 105-223 67zM615 680C382 643 193 523 66 330c-47-72-49-117-5-154 52-44 92-30 149 54 94 139 231 233 385 265 90 19 260 19 350 0 154-32 291-126 385-265 57-84 97-98 149-54 44 37 42 82-5 154-110 167-268 281-459 330-92 24-304 35-400 20z"
          transform="matrix(.1 0 0 -.1 0 144)"
          className="text-primary fill-current"
        />
      </svg>
    );
  },
);
