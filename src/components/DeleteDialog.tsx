import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import MessageDialog from "./MessageDialog";

type DeleteDialogProps = {
  mutate: (id: number) => void;
  isPending: boolean | undefined;
  id: number;
};

function DeleteDialog({ mutate, isPending, id }: DeleteDialogProps) {
  //uso del context per gestire l'apertura della dialog di messaggio e il messaggio da mostrare
  /* const { openDeleteForm, setOpenDeleteForm } = useDialogContext(); */

  return (
    <>
      <AlertDialog /* open={openDeleteForm} onOpenChange={setOpenDeleteForm} */>
        <AlertDialogTrigger
          nativeButton={false}
          render={
            <Button variant={"destructive"}>
              <Trash2 />
              Elimina
            </Button>
          }
        ></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Sei sicuro di volerlo eliminare?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Questo eliminerà
              permanentemente il giocatore dai nostri server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={() => mutate(id)}>
              {isPending ? <Loader2 className="animate-spin" /> : "Elimina"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog di messaggio dopo l'invio del form   */}
      <MessageDialog />
    </>
  );
}

export default DeleteDialog;
