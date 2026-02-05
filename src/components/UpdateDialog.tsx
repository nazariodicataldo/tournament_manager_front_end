import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import MessageDialog from "./MessageDialog";
import { useDialogContext } from "@/contexts/DialogContext";

type UpdateDialogProps = {
  children: React.ReactNode;
};

const UpdateDialog = ({ children }: UpdateDialogProps) => {
  //Uso del contesto per gestire lo stato della dialog e il messaggio
  /* const { openUpdateForm, setOpenUpdateForm } = useDialogContext(); */

  return (
    <>
      {/* Dialog che contiene il form */}
      <Dialog /* open={openUpdateForm} onOpenChange={setOpenUpdateForm} */>
        <DialogTrigger
          nativeButton={false}
          render={
            <Button variant={"outline"}>
              <Pencil />
              Modifica
            </Button>
          }
        />
        <DialogContent className="sm:max-w-md">{children}</DialogContent>
      </Dialog>

      {/* Dialog di messaggio dopo l'invio del form   */}
      <MessageDialog />
    </>
  );
};

export default UpdateDialog;
