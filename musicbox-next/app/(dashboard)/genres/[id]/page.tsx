"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getById, getAll, remove } from "@/lib/db";
import type { ApiGenre, ApiTrack, ApiAlbum } from "@/lib/db";
import RequireAuth from "@/components/RequireAuth";
import { t } from "@/lib/i18n";

export default function GenreDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [genre, setGenre] = useState<ApiGenre | null>(null);
  const [tracks, setTracks] = useState<ApiTrack[]>([]);
  const [albumsMap, setAlbumsMap] = useState<Record<string, string>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getById<ApiGenre>("genres", parseInt(id));
      if (!data) {
        router.push("/genres");
        return;
      }
      setGenre(data);

      const allTracks = await getAll<ApiTrack>("tracks");
      const genreTracks = allTracks.filter((track: ApiTrack) => track.GenreId === parseInt(id));
      setTracks(genreTracks);

      const allAlbums = await getAll<ApiAlbum>("albums");
      const aMap: Record<string, string> = {};
      allAlbums.forEach((alb: ApiAlbum) => {
        aMap[alb.AlbumId] = alb.Title;
      });
      setAlbumsMap(aMap);
    };
    fetchData();
  }, [id, router]);

  const handleDelete = async () => {
    await remove("genres", parseInt(id));
    router.push("/genres");
  };

  const formatDuration = (ms: number | null | undefined): string => {
    if (!ms) return "00:00";
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!genre) {
    return (
      <div className="flex justify-center items-center h-64 text-on-surface-variant font-label-caps animate-pulse">
        {t("genre.loading")}
      </div>
    );
  }

  return (
    <div className="space-y-stack-lg animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/genres" className="hover:text-primary transition-colors">{t("page.genres")}</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{genre.Name}</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
            <span className="material-symbols-outlined text-4xl text-secondary">library_music</span>
          </div>
          <div>
            <h2 className="text-headline-lg font-bold text-on-surface">{genre.Name}</h2>
            <p className="font-label-caps text-[10px] text-on-surface-variant opacity-60 mt-1">{t("track.id", { id: genre.GenreId })}</p>
          </div>
        </div>

      </div>

      <div className="bg-surface-medium surface-rim rounded-xl overflow-hidden">
        <div className="p-gutter border-b border-outline-variant/20">
          <h3 className="text-headline-md font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">audiotrack</span>
            {t("genre.tracks", { name: genre.Name, count: tracks.length })}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-low/50">
                <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.name")}</th>
                <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.album")}</th>
                <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase text-right">{t("list.duration")}</th>
                <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase text-right">{t("list.price")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {tracks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-gutter py-12 text-center text-on-surface-variant">{t("genre.no_tracks")}</td>
                </tr>
              ) : (
                tracks.map((track) => (
                  <tr key={track.TrackId} className="hover:bg-surface-high transition-colors group">
                    <td className="px-gutter py-stack-md font-medium text-on-surface">
                      <Link href={`/tracks/${track.TrackId}`} className="hover:text-primary transition-colors">{track.Name}</Link>
                    </td>
                    <td className="px-gutter py-stack-md text-on-surface">
                      {track.AlbumId ? (
                        <Link href={`/albums/${track.AlbumId}`} className="text-secondary hover:underline">
                          {albumsMap[track.AlbumId] || t("track.unknown")}
                        </Link>
                      ) : (
                        <span className="text-on-surface-variant opacity-60">{t("track.no_album")}</span>
                      )}
                    </td>
                    <td className="px-gutter py-stack-md text-right font-label-caps text-label-caps text-on-surface-variant">{formatDuration(track.Milliseconds)}</td>
                    <td className="px-gutter py-stack-md text-right font-label-caps text-label-caps text-primary">${track.UnitPrice?.toFixed(2) || "0.00"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-medium surface-rim p-gutter rounded-xl max-w-md w-full mx-4 shadow-xl">
            <div className="flex gap-4 items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-error-vibrant/20 flex items-center justify-center text-error-vibrant">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">{t("confirm.delete_title", { item: "Genre" })}</h3>
                <p className="text-on-surface-variant text-sm mt-1">{t("confirm.delete_text", { name: genre.Name })}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all">{t("confirm.cancel")}</button>
              <RequireAuth><button onClick={handleDelete} className="px-4 py-2 bg-error-vibrant hover:bg-error-vibrant/90 text-white font-semibold rounded-lg cursor-pointer transition-all">{t("confirm.delete")}</button></RequireAuth>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
