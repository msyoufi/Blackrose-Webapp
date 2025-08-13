import { Outlet } from "react-router"
import { ConfirmationDialogProvider } from "./shared/components/confirmation-dialog";
import { SnackbarProvider } from "./shared/components/snackbar";
import { PerfumeFormProvider } from "./pages/perfumes/perfume-form/perfume_form";

export default function App() {
  return (
    <ConfirmationDialogProvider>
      <SnackbarProvider>
        <PerfumeFormProvider>

          <header></header>

          <main>
            <Outlet />
          </main>

        </PerfumeFormProvider>
      </SnackbarProvider>
    </ConfirmationDialogProvider>
  );
}
