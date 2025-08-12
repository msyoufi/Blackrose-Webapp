import { Outlet } from "react-router"
import { ConfirmationDialogProvider } from "./shared/components/confirmation-dialog";
import { SnackbarProvider } from "./shared/components/snackbar";

export default function App() {
  return (
    <ConfirmationDialogProvider>
      <SnackbarProvider>

        <header></header>

        <main>
          <Outlet />
        </main>

      </SnackbarProvider>
    </ConfirmationDialogProvider>
  );
}
