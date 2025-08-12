import { Outlet } from "react-router"

export default function App() {
  return (
    <>
      <header></header>

      <main>
        <Outlet />
      </main>
    </>
  )
}
