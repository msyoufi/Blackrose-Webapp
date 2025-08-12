import { createBrowserRouter } from "react-router";
import App from "./App";
import PerfumesGrid from "./pages/perfumes/perfumes-grid";
import AdminLogin from "./pages/admin-login/admin-login";
import { getAllPerfumes } from "./shared/components/services/perfume.service";

export default createBrowserRouter([
  {
    Component: App,
    children: [
      { path: '/', Component: AdminLogin },
      {
        path: '/perfumes',
        Component: PerfumesGrid,
        loader: getAllPerfumes
      },
    ]
  }
]);