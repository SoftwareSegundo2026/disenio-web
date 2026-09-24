import Link from "next/link";
import { config } from "@/lib/config";

/*
  Paginación: muestra "Anterior / Siguiente" según la página actual.
  Se usa en el listado de productos (app/page.tsx).
  Total de páginas = total productos / productos por página.
*/

export function Pagination({
  total,
  page,
  categoria,
}: {
  total: number;
  page: number;
  categoria: string;
}) {
  const totalPaginas = Math.ceil(total / config.rowsPerPage);
  const baseUrl = `/?categoria=${categoria}`;

  return (
    <nav
      aria-label="Paginación"
      className="mt-8 flex items-center justify-center gap-4"
    >
      {page > 1 ? (
        <Link
          href={`${baseUrl}&pagina=${page - 1}`}
          className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary dark:border-gray-700"
        >
          ← Anterior
        </Link>
      ) : (
        <span className="rounded-full border border-border px-4 py-2 text-sm text-muted dark:border-gray-700">
          ← Anterior
        </span>
      )}

      <span className="text-sm text-muted">
        Página {page} de {totalPaginas}
      </span>

      {page < totalPaginas ? (
        <Link
          href={`${baseUrl}&pagina=${page + 1}`}
          className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary dark:border-gray-700"
        >
          Siguiente →
        </Link>
      ) : (
        <span className="rounded-full border border-border px-4 py-2 text-sm text-muted dark:border-gray-700">
          Siguiente →
        </span>
      )}
    </nav>
  );
}
