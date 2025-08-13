import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Alert, Snackbar } from "@mui/material";

const SnackbarContext = createContext<SnackbarContext | null>(null);

export function useSnackbar(): SnackbarContext {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error('Snackbar must be used in its context!');

  return context;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOepn] = useState(false);
  const [content, setContent] = useState('');
  const [severity, setSeverity] = useState<SnackbarSeverity>('success');
  const [duration, setDuration] = useState(3000);
  const [key, setKey] = useState<number>(0);

  const show = useCallback((
    content: string,
    severity: SnackbarSeverity = 'success',
    duration: number = 3000
  ) => {
    setContent(content);
    setSeverity(severity);
    setDuration(duration);
    setKey(new Date().getTime());
    setOepn(true);
  }, []);

  const contextValue = useMemo(() => ({ show }), [show]);

  return (
    <SnackbarContext value={contextValue}>
      {children}

      <Snackbar
        key={key}
        open={open}
        autoHideDuration={duration}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        onClose={() => setOepn(false)}
        slotProps={{
          clickAwayListener: {
            onClickAway: (e: any) => e.defaultMuiPrevented = true
          },
        }}
      >
        <Alert variant="filled" severity={severity}>
          {content}
        </Alert>
      </Snackbar>
    </SnackbarContext>
  );
}