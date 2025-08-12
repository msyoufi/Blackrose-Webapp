import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

const ConfirmationDialogContext = createContext<ConfirmationDialogContext | null>(null);

export function useConfirmationDialog(): ConfirmationDialogContext {
  const context = useContext<ConfirmationDialogContext | null>(ConfirmationDialogContext);
  if (!context) throw new Error('Snackbar musst be used in a context!');

  return context;
}

export function ConfirmationDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [resolvePromise, setResolvePromise] = useState<((val: boolean) => void) | null>(null);

  const ask = useCallback((
    title: string,
    content: string,
    action: string = 'Confirm'
  ) => {
    setTitle(title);
    setContent(content);
    setAction(action);
    setOpen(true);

    return new Promise<boolean>(resolve => {
      setResolvePromise(() => resolve);
    });
  }, []);


  const handleClose = (confirm: boolean) => {
    !!resolvePromise && resolvePromise(confirm);

    setOpen(false);
    setResolvePromise(null);
  }

  const contextValue = useMemo(() => ({ ask }), [ask]);

  return (
    <ConfirmationDialogContext value={contextValue}>
      {children}

      <Dialog open={open}>
        <DialogTitle >{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>

        <DialogActions>
          <Button
            onClick={() => handleClose(true)}
            variant='outlined'
            color='error'
          >
            {action}
          </Button>

          <Button onClick={() => handleClose(false)}            >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </ConfirmationDialogContext>
  );
}