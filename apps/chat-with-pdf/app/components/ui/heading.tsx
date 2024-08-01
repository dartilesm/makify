import { Button, Skeleton } from "@makify/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactElement } from "react";

interface HeadingProps {
  loading?: boolean;
  title: string;
  description?: string;
  actionButton?: ReactElement;
  backButton?: boolean;
}

export function Heading({
  loading,
  title,
  description,
  actionButton,
  backButton,
}: HeadingProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          {!loading && backButton && (
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
          {loading && backButton && <Skeleton className="h-7 w-7" />}
          {!loading && title && (
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          )}
          {loading && <Skeleton className="h-8 w-32" />}
        </div>
        {!loading && description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
        {loading && <Skeleton className="h-4 w-72" />}
      </div>
      {!loading && actionButton}
      {loading && <Skeleton className="h-10 w-32" />}
    </div>
  );
}
