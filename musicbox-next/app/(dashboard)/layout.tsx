import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

/*
  Layout del dashboard (rutas protegidas).
  Renderiza Sidebar (navegación lateral) y Header
  (barra superior) en todas las páginas del dashboard.
  El contenido de cada ruta se inyecta en {children}.
*/
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-col min-h-screen ml-sidebar-width">
        <Header />

        <main className="flex-1 px-gutter py-stack-lg overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
