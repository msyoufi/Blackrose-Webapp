interface SnackbarContext {
  show: (
    content: string,
    severity?: SnackbarSeverity,
    duration?: number
  ) => void
};

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

interface ConfirmationDialogContext {
  ask: (
    title: string,
    content: string,
    action: string
  ) => Promise<boolean>
}

interface PerfumeFormContext {
  open: (perfume?: Perfume) => void,
  close: () => void
}
