"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { config } from "@/lib/config";
import { getAll, getTotalCount, remove } from "@/lib/db";
import type { ApiGenre } from "@/lib/db";
import RequireAuth from "@/components/RequireAuth";
import Pagination from "@/components/Pagination";
import Swal from "sweetalert2";
import { t } from "@/lib/i18n";

export default function GenresList() {
  const [genres, setGenres] = useState<ApiGenre[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = config.rowsPerPage;

  const loadGenres = async (p: number) => {
    const list = await getAll<ApiGenre>("genres", p * rowsPerPage, rowsPerPage);
    setGenres(list);
  };

  useEffect(() => {
    loadGenres(page);
  }, [page]);

  const fetchTotal = async () => {
    const total = await getTotalCount("genres");
    setTotalCount(total);
  };

  useEffect(() => {
    fetchTotal();
  }, []);

  const handleDelete = async (genre: ApiGenre) => {
    const result = await Swal.fire({
      title: t("confirm.delete_title", { item: "Genre" }),
      text: t("confirm.delete_text", { name: genre.Name }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("confirm.delete"),
      cancelButtonText: t("confirm.cancel"),
    });
    if (!result.isConfirmed) return;
    try {
      await remove("genres", genre.GenreId);
      if (genres.length === 1 && page > 0) setPage(page - 1);
      else await loadGenres(page);
      setTotalCount((c) => c - 1);
      Swal.fire(t("confirm.deleted_title"), t("confirm.deleted_text", { name: genre.Name }), "success");
    } catch {
      Swal.fire(t("confirm.error_title"), t("confirm.error_text", { item: "genre" }), "error");
    }
  };

  return (
    <div className="space-y-stack-md animate-fadeIn">
      <div className="flex justify-between items-center mb-stack-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">{t("page.genres")}</h2>
          <p className="text-on-surface-variant">{t("page.genres_sub")}</p>
        </div>
        <RequireAuth>
          <Link href="/genres/new">
            <button className="bg-primary-container hover:bg-primary-container/90 text-on-primary font-bold py-2 px-stack-lg rounded-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">library_add</span>{t("page.add_genre")}
            </button>
          </Link>
        </RequireAuth>
      </div>

      <div className="bg-surface-medium surface-rim rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-low/50">
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.id")}</th>
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.name")}</th>
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase text-right">{t("list.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {genres.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-gutter py-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">library_music</span>
                  {t("page.empty_genres")}
                </td>
              </tr>
            ) : (
              genres.map((g) => (
                <tr key={g.GenreId} className="hover:bg-surface-high transition-colors group">
                  <td className="px-gutter py-stack-md font-label-caps text-label-caps text-secondary opacity-70">{g.GenreId}</td>
                  <td className="px-gutter py-stack-md font-semibold text-on-surface">{g.Name}</td>
                  <td className="px-gutter py-stack-md text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/genres/${g.GenreId}`}>
                        <button className="p-1 hover:text-primary transition-colors cursor-pointer" title={t("list.view_details")}><span className="material-symbols-outlined text-xl">visibility</span></button>
                      </Link>
                      <RequireAuth>
                        <Link href={`/genres/${g.GenreId}/edit`}>
                          <button className="p-1 hover:text-secondary transition-colors cursor-pointer" title={t("list.edit")}><span className="material-symbols-outlined text-xl">edit</span></button>
                        </Link>
                      </RequireAuth>
                      <RequireAuth>
                        <button onClick={() => handleDelete(g)} className="p-1 hover:text-error-vibrant transition-colors cursor-pointer" title={t("list.delete")}><span className="material-symbols-outlined text-xl">delete</span></button>
                      </RequireAuth>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination page={page} totalCount={totalCount} rowsPerPage={rowsPerPage} onPageChange={setPage} />
      </div>
    </div>
  );
}
