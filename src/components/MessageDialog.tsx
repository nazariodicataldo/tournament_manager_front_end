import { useDialogContext } from "@/contexts/DialogContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";

const MessageDialog = () => {
  // Uso del contesto per ottenere lo stato della dialog e il messaggio
  const { openDialog: open, message, setOpenDialog: setOpen } = useDialogContext();
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription className="text-lg">{message}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
