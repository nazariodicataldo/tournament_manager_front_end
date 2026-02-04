import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import MessageDialog from "./MessageDialog";

type CreateDialogProps = {
  text: string;
  children: React.ReactNode;
  openForm: boolean;
  setOpenForm: (open: boolean) => void;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  message?: string;
};

const CreateDialog = ({
  text,
  children,
  openForm,
  setOpenForm,
  openDialog,
  setOpenDialog,
  message,
}: CreateDialogProps) => {
  return (
    <>
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogTrigger
          nativeButton={false}
          render={
            <Button size={"lg"}>
              <PlusIcon />
              {text}
            </Button>
          }
        />
        <DialogContent className="sm:max-w-md">{children}</DialogContent>
      </Dialog>
      <MessageDialog open={openDialog} setOpen={setOpenDialog} message={message} />
    </>
  );
};

export default CreateDialog;
