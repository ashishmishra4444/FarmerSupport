import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Layout = () => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7,_#ecfdf5_45%,_#f8fafc_100%)] text-slate-900">
    <Navbar />
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Outlet />
    </main>
  </div>
);
