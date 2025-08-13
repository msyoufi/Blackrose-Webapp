import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import router from './routes.ts'
import './styles.scss';
import './shared/styles/index.scss';
import { AuthProvider } from './shared/context/auth.provider.tsx';
import { ConfirmationDialogProvider } from './shared/components/confirmation-dialog.tsx';
import { SnackbarProvider } from './shared/components/snackbar.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ConfirmationDialogProvider>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </ConfirmationDialogProvider>
    </AuthProvider>
  </StrictMode >
)
