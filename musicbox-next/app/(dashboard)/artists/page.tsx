"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { config } from "@/lib/config";
import { getAllArtists, getArtistCount, deleteArtist, getIsAdmin } from "@/lib/db";
import type { ApiArtist } from "@/lib/db";
import Pagination from "@/components/Pagination";
import Swal from "sweetalert2";
import { t } from "@/lib/i18n";

/*
  Página: Lista de artistas con paginación.
  Carga los artistas desde el backend según la página actual,
  muestra el total de registros y permite al admin eliminar.
  Los datos se piden con getAllArtists() y getArtistCount().
  La paginación se maneja con skip/limit en la URL.
  La eliminación usa SweetAlert2 para confirmación.
*/
export default function ArtistsList() {
  const [artists, setArtists] = useState<ApiArtist[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = config.rowsPerPage;
  const isAdmin = getIsAdmin();

  const loadArtists = async (p: number) => {
    const list = await getAllArtists(p * rowsPerPage, rowsPerPage);
    setArtists(list);
  };

  useEffect(() => {
    loadArtists(page);
  }, [page]);

  const fetchTotal = async () => {
    const total = await getArtistCount();
    setTotalCount(total);
  };

  useEffect(() => {
    fetchTotal();
  }, []);

  const handleDelete = async (artist: ApiArtist) => {
    const result = await Swal.fire({
      title: t("confirm.delete_title", { item: "Artist" }),
      text: t("confirm.delete_text", { name: artist.Name }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("confirm.delete"),
      cancelButtonText: t("confirm.cancel"),
    });
    if (!result.isConfirmed) return;
    try {
      await deleteArtist(artist.ArtistId);
      if (artists.length === 1 && page > 0) setPage(page - 1);
      else await loadArtists(page);
      setTotalCount((c) => c - 1);
      Swal.fire(t("confirm.deleted_title"), t("confirm.deleted_text", { name: artist.Name }), "success");
    } catch {
      Swal.fire(t("confirm.error_title"), t("confirm.error_text", { item: "artist" }), "error");
    }
  };

  return (
    <div className="space-y-stack-md animate-fadeIn">
      <div className="flex justify-between items-center mb-stack-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">{t("page.artists")}</h2>
          <p className="text-on-surface-variant">{t("page.artists_sub")}</p>
        </div>
        {isAdmin && (
          <Link href="/artists/new">
            <button className="bg-primary-container hover:bg-primary-container/90 text-on-primary font-bold py-2 px-stack-lg rounded-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">person_add</span>
              {t("page.add_artist")}
            </button>
          </Link>
        )}
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
            {artists.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-gutter py-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">group</span>
                  {t("page.empty_artists")}
                </td>
              </tr>
            ) : (
              artists.map((artist) => (
                <tr key={artist.ArtistId} className="hover:bg-surface-high transition-colors group">
                  <td className="px-gutter py-stack-md font-label-caps text-label-caps text-primary opacity-70">{artist.ArtistId}</td>
                  <td className="px-gutter py-stack-md font-semibold text-on-surface">{artist.Name}</td>
                  <td className="px-gutter py-stack-md text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/artists/${artist.ArtistId}`}>
                        <button className="p-1 hover:text-primary transition-colors cursor-pointer" title={t("list.view_details")}>
                          <span className="material-symbols-outlined text-xl">visibility</span>
                        </button>
                      </Link>
                      {isAdmin && (
                        <Link href={`/artists/${artist.ArtistId}/edit`}>
                          <button className="p-1 hover:text-secondary transition-colors cursor-pointer" title={t("list.edit")}>
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                        </Link>
                      )}
                      {isAdmin && (
                        <button onClick={() => handleDelete(artist)} className="p-1 hover:text-error-vibrant transition-colors cursor-pointer" title={t("list.delete")}>
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      )}
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
