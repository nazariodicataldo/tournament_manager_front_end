import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useDialogContext } from "@/contexts/DialogContext";

type UpdateDialogProps = {
  children: React.ReactNode;
  text: string;
};

const UpdateDialog = ({ children, text }: UpdateDialogProps) => {
  //Uso del contesto per gestire lo stato della dialog e il messaggio
  const { openUpdateForm, setOpenUpdateForm } = useDialogContext();

  return (
    <>
      {/* Dialog che contiene il form */}
      <Dialog open={openUpdateForm} onOpenChange={setOpenUpdateForm}>
        <DialogTrigger
          nativeButton={false}
          render={
            <Button variant={"outline"}>
              <Pencil />
              {text}
            </Button>
          }
        />
        <DialogContent className="sm:max-w-md">{children}</DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateDialog;
