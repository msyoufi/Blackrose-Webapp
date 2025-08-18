import { Outlet } from "react-router"
import { PerfumeFormProvider } from "./pages/perfumes/perfume-form/perfume_form";
import Header from "./shared/components/header/header";
import { useAuth } from "./shared/context/auth.provider";
import { CircularProgress } from "@mui/material";
import AdminLogin from "./pages/admin-login/admin-login";
import { PerfumesProvider } from "./shared/context/perfumes.provider";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="overlay">
      <CircularProgress size={30} />
    </div>
  );

  if (!user) return <AdminLogin />;

  return (
    <PerfumesProvider>
      <PerfumeFormProvider>

        <Header />

        <main>
          <Outlet />
        </main>

      </PerfumeFormProvider>
    </PerfumesProvider>
  );
}
