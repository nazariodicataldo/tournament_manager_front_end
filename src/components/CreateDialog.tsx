import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import MessageDialog from "./MessageDialog";
import { useDialogContext } from "@/contexts/DialogContext";

export type CreateDialogProps = {
  text: string;
  children: React.ReactNode;
  disabled?: boolean;
};

const CreateDialog = ({ text, children, disabled }: CreateDialogProps) => {
  //Uso del contesto per gestire lo stato della dialog e il messaggio
  /* const { openForm, setOpenForm } =   useDialogContext(); */

  return (
    <>
      {/* Dialog che contiene il form */}
      <Dialog /* open={openForm} onOpenChange={setOpenForm} */>
        <DialogTrigger
          nativeButton={false}
          render={
            <Button disabled={disabled} size={"lg"}>
              <PlusIcon />
              {text}
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

export default CreateDialog;
