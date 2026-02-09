import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { PackageOpen } from "lucide-react";
import CreateDialog, { type CreateDialogProps } from "./CreateDialog";

type EmptyResultProps = {
  title: string;
  description: string;
};

function EmptyResult({
  title,
  description,
  text,
  children,
}: EmptyResultProps & Partial<Omit<CreateDialogProps, "disaled">>) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpen />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {/* Mostro il pulsante per aggiungere la risorsa solo se la mutation è presente */}
      {text && (
        <EmptyContent className="flex justify-center">
          <CreateDialog text={text!} children={children!} />{" "}
          {/* Metterò ! perchè a questo punto so che l'utente passerà i dati della dialog, che di default sono parrtial */}
        </EmptyContent>
      )}
    </Empty>
  );
}

export default EmptyResult;
