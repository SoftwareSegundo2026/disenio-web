"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getById, getAll, remove, getImageUrl } from "@/lib/db";
import type { ApiAlbum, ApiArtist, ApiTrack, ApiGenre } from "@/lib/db";
import RequireAuth from "@/components/RequireAuth";
import { t } from "@/lib/i18n";

export default function AlbumDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [album, setAlbum] = useState<ApiAlbum | null>(null);
  const [artist, setArtist] = useState<ApiArtist | null>(null);
  const [tracks, setTracks] = useState<ApiTrack[]>([]);
  const [genresMap, setGenresMap] = useState<Record<number, string>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getById("albums", parseInt(id)) as ApiAlbum;
      if (!data) {
        router.push("/albums");
        return;
      }
      setAlbum(data);

      if (data.ArtistId) {
        const art = await getById("artists", data.ArtistId) as ApiArtist;
        setArtist(art);
      }

      const allTracks = await getAll("tracks") as ApiTrack[];
      const albumTracks = allTracks.filter((track: ApiTrack) => track.AlbumId === parseInt(id));
      setTracks(albumTracks);

      const allGenres = await getAll("genres") as ApiGenre[];
      const gMap: Record<number, string> = {};
      allGenres.forEach((g: ApiGenre) => {
        gMap[g.GenreId] = g.Name;
      });
      setGenresMap(gMap);
    })();
  }, [id, router]);

  const handleDelete = async () => {
    await remove("albums", parseInt(id));
    router.push("/albums");
  };

  const formatDuration = (ms: number | null | undefined): string => {
    if (!ms) return "00:00";
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!album) {
    return (
      <div className="flex justify-center items-center h-64 text-on-surface-variant font-label-caps animate-pulse">
        {t("album.loading")}
      </div>
    );
  }

  return (
    <div className="space-y-stack-lg animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/albums" className="hover:text-primary transition-colors">{t("page.albums")}</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{album.Title}</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl flex justify-between items-center">
        <div className="flex items-center gap-6">
          {getImageUrl(album.ImageUrl) ? (
            <img src={getImageUrl(album.ImageUrl)!} alt={album.Title}
              className="w-20 h-20 rounded-xl object-cover border-2 border-primary/30" />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
              <span className="material-symbols-outlined text-4xl text-secondary">album</span>
            </div>
          )}
          <div>
            <h2 className="text-headline-lg font-bold text-on-surface">{album.Title}</h2>
            <p className="text-on-surface-variant">
              {t("album.artist")}{artist ? (
                <Link href={`/artists/${artist.ArtistId}`} className="text-primary hover:underline font-semibold">{artist.Name}</Link>
              ) : (
                <span className="opacity-60 italic">{t("track.unknown")}</span>
              )}
            </p>
            <p className="font-label-caps text-[10px] text-on-surface-variant opacity-60 mt-1">{t("track.id", { id: album.AlbumId })}</p>
          </div>
        </div>

      </div>

      <div className="bg-surface-medium surface-rim rounded-xl overflow-hidden">
        <div className="p-gutter border-b border-outline-variant/20 flex justify-between items-center">
          <h3 className="text-headline-md font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">audiotrack</span>{t("album.tracks", { count: tracks.length })}
          </h3>
          <RequireAuth>
            <Link href={`/tracks/new?albumId=${id}`}>
              <button className="bg-primary-container hover:bg-primary-container/90 text-on-primary font-bold py-1.5 px-4 rounded-lg flex items-center gap-2 cursor-pointer transition-all text-sm active:scale-95">
                <span className="material-symbols-outlined text-sm">library_add</span>{t("album.add_track")}
              </button>
            </Link>
          </RequireAuth>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-low/50">
                <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.name")}</th>
                <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.genre")}</th>
                <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase text-right">{t("list.duration")}</th>
                <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase text-right">{t("list.price")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {tracks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-gutter py-12 text-center text-on-surface-variant">{t("album.no_tracks")}</td>
                </tr>
              ) : (
                tracks.map((track) => (
                  <tr key={track.TrackId} className="hover:bg-surface-high transition-colors group">
                    <td className="px-gutter py-stack-md font-medium text-on-surface">
                      <Link href={`/tracks/${track.TrackId}`} className="hover:text-primary transition-colors">{track.Name}</Link>
                    </td>
                    <td className="px-gutter py-stack-md">
                      {track.GenreId ? (
                        <Link href={`/genres/${track.GenreId}`} className="px-2 py-0.5 rounded bg-surface-high text-on-surface-variant text-[11px] font-label-caps border border-outline-variant/20 hover:text-primary transition-colors">
                          {genresMap[track.GenreId] || t("track.unknown")}
                        </Link>
                      ) : (
                        <span className="text-on-surface-variant opacity-60">{t("list.no_genre")}</span>
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
                <h3 className="text-lg font-bold text-on-surface">{t("confirm.delete_title", { item: "Album" })}</h3>
                <p className="text-on-surface-variant text-sm mt-1">{t("confirm.delete_text", { name: album.Title })}</p>
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
