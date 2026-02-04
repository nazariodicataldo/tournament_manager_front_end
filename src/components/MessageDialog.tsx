import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";

type MessageDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  message?: string;
};

const MessageDialog = ({ open, setOpen, message }: MessageDialogProps) => {
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
