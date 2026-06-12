import { t } from "@/lib/i18n";

interface PaginationProps {
  page: number;
  totalCount: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
}

/*
  Componente reutilizable de paginación.
  Calcula el total de páginas desde totalCount / rowsPerPage,
  muestra la página actual y botones Anterior/Siguiente.
  Si hay muchas páginas, también muestra atajos (1...N).
  onPageChange(page) notifica al padre el cambio de página.
*/
export default function Pagination({ page, totalCount, rowsPerPage, onPageChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  if (totalCount === 0) return null;

  return (
    <div className="flex items-center justify-between px-gutter py-stack-md border-t border-outline-variant/10">
      <div className="text-sm text-on-surface-variant font-label-caps">
        {t("pagination.page", { page: String(page + 1), total: String(pageCount), count: String(totalCount) })}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="flex items-center gap-1 px-3 py-1.5 bg-surface-high hover:bg-surface-high/80 disabled:opacity-30 text-on-surface rounded-lg cursor-pointer transition-all text-sm font-semibold disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
          {t("pagination.previous")}
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount - 1}
          className="flex items-center gap-1 px-3 py-1.5 bg-surface-high hover:bg-surface-high/80 disabled:opacity-30 text-on-surface rounded-lg cursor-pointer transition-all text-sm font-semibold disabled:cursor-not-allowed"
        >
          {t("pagination.next")}
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
