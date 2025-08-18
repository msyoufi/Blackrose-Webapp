import type { User } from "firebase/auth";

declare global {

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

  interface AuthContext {
    user: User | null;
    loading: boolean;
  };

  interface PDFConfigContext {
    ask: () => Promise<PDFConfig | null>
  }

  type PerfumesContext = [Perfume[], unknown, boolean];

  interface PerfumeOrderFormContext {
    open: (perfume: Perfume) => void,
    close: () => void
  }
}
