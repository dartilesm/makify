import { Button } from "@makify/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactElement } from "react";

interface HeadingProps {
  title: string;
  description?: string;
  actionButton?: ReactElement;
  backButton?: boolean;
}

export function Heading({
  title,
  description,
  actionButton,
  backButton,
}: HeadingProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          {backButton && (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="box-content h-7 w-7 hover:bg-transparent"
            >
              <Link href="./">
                <ArrowLeft className="text-foreground" />
              </Link>
            </Button>
          )}
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        </div>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {actionButton}
    </div>
  );
}
