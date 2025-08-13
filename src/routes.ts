import { createBrowserRouter } from "react-router";
import App from "./App";
import PerfumesGrid from "./pages/perfumes/perfumes-grid";
import AdminLogin from "./pages/admin-login/admin-login";

export default createBrowserRouter([
  {
    Component: App,
    children: [
      { path: '/', Component: AdminLogin },
      { path: '/perfumes', Component: PerfumesGrid },
    ]
  }
]);