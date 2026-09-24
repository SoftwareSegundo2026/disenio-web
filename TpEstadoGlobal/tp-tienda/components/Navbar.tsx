"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/stores/cart-store";
import { useTheme } from "@/lib/context/theme-context";
import { useSearchStore } from "@/lib/stores/search-store";
import { config } from "@/lib/config";

/*
  Barra de navegación.

  - Muestra la cantidad de items del carrito (lectura del store con Zustand).
  - Botón para alternar tema claro/oscuro (Context API).
  - Campo de búsqueda conectado al store de búsqueda (search-store).

  NOTA: el campo de búsqueda solo va a reaccionar cuando completes
  setTermino en lib/stores/search-store.ts (TODO TP).
*/

export function Navbar() {
  const totalItems = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.quantity, 0),
  );
  const { theme, toggleTheme } = useTheme();
  const termino = useSearchStore((s) => s.termino);
  const setTermino = useSearchStore((s) => s.setTermino);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-primary">
          {config.appName}
        </Link>

        <div className="flex flex-1 items-center justify-center gap-4">
          <input
            type="search"
            placeholder="Buscar productos..."
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            className="w-full max-w-xs rounded-full border border-border bg-background px-4 py-1.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/favoritos"
            className="rounded-full px-3 py-1.5 text-sm text-muted hover:text-primary"
          >
            Favoritos
          </Link>
          <Link
            href="/pedidos"
            className="rounded-full px-3 py-1.5 text-sm text-muted hover:text-primary"
          >
            Pedidos
          </Link>
          <Link
            href="/comentarios"
            className="hidden rounded-full px-3 py-1.5 text-sm text-muted hover:text-primary sm:block"
          >
            Comentarios
          </Link>
          <button
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="rounded-full px-3 py-1.5 text-sm text-muted hover:text-primary"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <Link
            href="/carrito"
            className="relative rounded-full px-3 py-1.5 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            🛒 Carrito
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
