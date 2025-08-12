interface SnackbarContext {
  show: (
    content: string,
    severity?: SnackbarSeverity,
    duration?: number
  ) => void
};

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';