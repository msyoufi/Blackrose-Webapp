import { createBrowserRouter } from "react-router";
import App from "./App";
import PerfumesGrid from "./pages/perfumes/perfumes-grid";

export default createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: PerfumesGrid },
    ]
  }
]);