"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { config } from "@/lib/config";
import { getAll, getTotalCount, remove, getIsAdmin } from "@/lib/db";
import type { ApiTrack } from "@/lib/db";
import Pagination from "@/components/Pagination";
import Swal from "sweetalert2";
import { t } from "@/lib/i18n";

export default function TracksList() {
  const [tracks, setTracks] = useState<ApiTrack[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = config.rowsPerPage;
  const isAdmin = getIsAdmin();

  const loadTracks = async (p: number) => {
    const list = await getAll<ApiTrack>("tracks", p * rowsPerPage, rowsPerPage);
    setTracks(list);
  };

  useEffect(() => {
    loadTracks(page);
  }, [page]);

  const fetchTotal = async () => {
    const total = await getTotalCount("tracks");
    setTotalCount(total);
  };

  useEffect(() => {
    fetchTotal();
  }, []);

  const formatDuration = (ms: number | null | undefined): string => {
    if (!ms) return "00:00";
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDelete = async (track: ApiTrack) => {
    const result = await Swal.fire({
      title: t("confirm.delete_title", { item: "Track" }),
      text: t("confirm.delete_text", { name: track.Name }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("confirm.delete"),
      cancelButtonText: t("confirm.cancel"),
    });
    if (!result.isConfirmed) return;
    try {
      await remove("tracks", track.TrackId);
      if (tracks.length === 1 && page > 0) setPage(page - 1);
      else await loadTracks(page);
      setTotalCount((c) => c - 1);
      Swal.fire(t("confirm.deleted_title"), t("confirm.deleted_text", { name: track.Name }), "success");
    } catch {
      Swal.fire(t("confirm.error_title"), t("confirm.error_text", { item: "track" }), "error");
    }
  };

  return (
    <div className="space-y-stack-md animate-fadeIn">
      <div className="flex justify-between items-center mb-stack-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">{t("page.tracks")}</h2>
          <p className="text-on-surface-variant">{t("page.tracks_sub")}</p>
        </div>
        {isAdmin && (
          <Link href="/tracks/new">
            <button className="bg-primary-container hover:bg-primary-container/90 text-on-primary font-bold py-2 px-stack-lg rounded-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">library_add</span>{t("page.add_track")}
            </button>
          </Link>
        )}
      </div>

      <div className="bg-surface-medium surface-rim rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-low/50">
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.name")}</th>
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.album")}</th>
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.genre")}</th>
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase text-right">{t("list.duration")}</th>
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase text-right">{t("list.price")}</th>
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase text-right">{t("list.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {tracks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-gutter py-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">audiotrack</span>
                  {t("page.empty_tracks")}
                </td>
              </tr>
            ) : (
              tracks.map((track) => (
                <tr key={track.TrackId} className="hover:bg-surface-high transition-colors group">
                  <td className="px-gutter py-stack-md font-semibold text-on-surface">
                    {track.Name}
                    {track.Composer && (
                      <span className="block text-[11px] font-normal text-on-surface-variant opacity-70">{t("track.by_artist", { name: track.Composer })}</span>
                    )}
                  </td>
                  <td className="px-gutter py-stack-md text-on-surface">
                    {track.AlbumId ? (
                      <Link href={`/albums/${track.AlbumId}`} className="text-secondary hover:underline hover:text-secondary-container">
                        {track.AlbumTitle || t("track.unknown")}
                      </Link>
                    ) : (
                      <span className="text-on-surface-variant opacity-60">{t("track.no_album")}</span>
                    )}
                  </td>
                  <td className="px-gutter py-stack-md">
                    {track.GenreId ? (
                      <Link href={`/genres/${track.GenreId}`} className="px-2 py-0.5 rounded bg-surface-high text-on-surface-variant text-[11px] font-label-caps border border-outline-variant/20 hover:text-primary transition-colors">
                        {track.GenreName || t("track.unknown")}
                      </Link>
                    ) : (
                      <span className="text-on-surface-variant opacity-60">{t("list.no_genre")}</span>
                    )}
                  </td>
                  <td className="px-gutter py-stack-md text-right font-label-caps text-label-caps text-on-surface-variant">{formatDuration(track.Milliseconds)}</td>
                  <td className="px-gutter py-stack-md text-right font-label-caps text-label-caps text-primary">${track.UnitPrice?.toFixed(2) || "0.00"}</td>
                  <td className="px-gutter py-stack-md text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/tracks/${track.TrackId}`}>
                        <button className="p-1 hover:text-primary transition-colors cursor-pointer" title={t("list.view_details")}><span className="material-symbols-outlined text-xl">visibility</span></button>
                      </Link>
                      {isAdmin && (
                        <Link href={`/tracks/${track.TrackId}/edit`}>
                          <button className="p-1 hover:text-secondary transition-colors cursor-pointer" title={t("list.edit")}><span className="material-symbols-outlined text-xl">edit</span></button>
                        </Link>
                      )}
                      {isAdmin && (
                        <button onClick={() => handleDelete(track)} className="p-1 hover:text-error-vibrant transition-colors cursor-pointer" title={t("list.delete")}><span className="material-symbols-outlined text-xl">delete</span></button>
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
