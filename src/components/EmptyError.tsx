import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { TriangleAlert, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QueryObserverResult } from "@tanstack/react-query";

type EmptyErrorProps<T> = {
  title: string;
  error: Error;
  refetch: (
  ) => Promise<QueryObserverResult<T, Error>>;
};

function EmptyError<T>({ title, error, refetch }: EmptyErrorProps<T>) {
  return (
    <Empty className="bg-muted/30 h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlert />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          {error.message}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size={"lg"} onClick={() => refetch()}>
          <RefreshCcwIcon data-icon="inline-start" />
          Ricarica
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export default EmptyError;
