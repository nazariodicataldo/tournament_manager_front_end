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
import { Loader2, ShieldOff, Trash2 } from "lucide-react";
import { useDialogContext } from "@/contexts/DialogContext";

type DeleteDialogProps = {
  mutate?: (id: number) => void;
  isPending: boolean | undefined;
  id: number;
  updateMutate?: (args: {
    id: number;
    data: { [key: string]: number | string | null };
  }) => void;
};

function DeleteDialog({
  mutate,
  isPending,
  id,
  updateMutate,
}: DeleteDialogProps) {
  //uso del context per gestire l'apertura della dialog di messaggio e il messaggio da mostrare
  const { openDeleteForm, setOpenDeleteForm } = useDialogContext();

  return (
    <>
      <AlertDialog open={openDeleteForm} onOpenChange={setOpenDeleteForm}>
        <AlertDialogTrigger
          nativeButton={false}
          render={
            <Button variant={"destructive"}>
              {!updateMutate ? <Trash2 /> : <ShieldOff />}
              {!updateMutate ? "Elimina" : "Rimuovi"}
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
            <AlertDialogAction
              variant={"destructive"}
              disabled={isPending}
              onClick={
                updateMutate
                  ? () =>
                      updateMutate({ id, data: { teamId: null, number: null } })
                  : () => mutate!(id)
              }
            >
              {isPending ? <Loader2 className="animate-spin" /> : "Elimina"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default DeleteDialog;
