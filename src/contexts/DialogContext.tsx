import { createContext, useContext, useState } from "react";

type DialogContextProps = {
  openForm: boolean;
  setOpenForm: (open: boolean) => void;
  openDeleteForm: boolean;
  setOpenDeleteForm: (open: boolean) => void;
  openUpdateForm: boolean;
  setOpenUpdateForm: (open: boolean) => void;
  /* openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  message: string;
  setMessage: (message: string) => void; */
};

export const DialogContext = createContext<DialogContextProps | undefined>(
  undefined,
);

const DialogContextProvider = ({ children }: React.PropsWithChildren) => {
  const [openForm, setOpenForm] =
    useState<DialogContextProps["openForm"]>(false); //Stato per l'apertura del form
  /* const [openDialog, setOpenDialog] = useState<DialogContextProps["openDialog"]>(false); */ //Stato per l'apertura della modal di messaggio
  /* const [message, setMessage] = useState<DialogContextProps["message"]>(''); */ //stato che salva il messaggio da mostrare nella modal
  const [openDeleteForm, setOpenDeleteForm] =
    useState<DialogContextProps["openDeleteForm"]>(false); //Stato per l'apertura del form di eliminazione
  const [openUpdateForm, setOpenUpdateForm] =
    useState<DialogContextProps["openUpdateForm"]>(false); //Stato per l'apertura del form di aggiornamento

  return (
    <DialogContext.Provider
      value={{
        openForm,
        setOpenForm,
        openDeleteForm,
        setOpenDeleteForm,
        openUpdateForm,
        setOpenUpdateForm,
        /* openDialog,
        setOpenDialog,
        message,
        setMessage */
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export default DialogContextProvider;

export function useDialogContext() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error(
      "useDialogContext deve essere dentro un DialogContextProvider",
    );
  }
  return context;
}
