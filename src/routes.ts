import { createBrowserRouter } from "react-router";
import App from "./App";
import Perfumes from "./pages/perfumes/perfumes";
import AdminLogin from "./pages/admin-login/admin-login";

export default createBrowserRouter([
  {
    Component: App,
    children: [
      { path: '/', Component: AdminLogin },
      { path: '/perfumes', Component: Perfumes },
    ]
  }
]);