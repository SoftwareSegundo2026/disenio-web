"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTrackById, getAlbumById, getArtistById, getGenreById, deleteTrack, getToken } from "@/lib/db";
import { t } from "@/lib/i18n";
import type { ApiTrack, ApiAlbum, ApiArtist, ApiGenre } from "@/lib/db";
import DeezerPlayer from "@/components/DeezerPlayer";
import { getIsAdmin } from "@/lib/db";

/*
  Página: Detalle de una canción.
  Carga el track (getTrackById), su álbum (getAlbumById),
  artista (getArtistById) y género (getGenreById) para mostrar
  toda la información relacionada. Incluye un reproductor Deezer
  y link al álbum/artista. El admin puede eliminar la canción.
*/
export default function TrackDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [track, setTrack] = useState<ApiTrack | null>(null);
  const [album, setAlbum] = useState<ApiAlbum | null>(null);
  const [artist, setArtist] = useState<ApiArtist | null>(null);
  const [genre, setGenre] = useState<ApiGenre | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isAdmin = getIsAdmin();

  useEffect(() => {
    const loadData = async () => {
      const trackId = parseInt(id);
      const data = await getTrackById(trackId);
      if (!data) {
        router.push("/tracks");
        return;
      }
      setTrack(data);

      if (data.AlbumId) {
        const alb = await getAlbumById(data.AlbumId);
        setAlbum(alb);
        if (alb?.ArtistId) {
          const art = await getArtistById(alb.ArtistId);
          setArtist(art);
        }
      }

      if (data.GenreId) {
        const gen = await getGenreById(data.GenreId);
        setGenre(gen);
      }
    };
    loadData();
  }, [id, router]);

  const handleDelete = async () => {
    await deleteTrack(parseInt(id));
    router.push("/tracks");
  };

  const formatDuration = (ms: number | null | undefined): string => {
    if (!ms) return "00:00";
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatSize = (bytes: number | null | undefined): string => {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  if (!track) {
    return (
      <div className="flex justify-center items-center h-64 text-on-surface-variant font-label-caps animate-pulse">
        Loading track details...
      </div>
    );
  }

  return (
    <div className="space-y-stack-lg animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/tracks" className="hover:text-primary transition-colors">Tracks</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{track.Name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 space-y-stack-md">
          <div className="bg-surface-medium surface-rim p-gutter rounded-xl flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">audiotrack</span>
              </div>
              <div>
                <h2 className="text-headline-lg font-bold text-on-surface">{track.Name}</h2>
                <p className="text-on-surface-variant">Composer: <span className="text-on-surface">{track.Composer || "Unknown"}</span></p>
                <p className="font-label-caps text-[10px] text-on-surface-variant opacity-60 mt-1">ID: {track.TrackId}</p>
              </div>
            </div>

          </div>

          <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
            <h3 className="text-headline-md font-bold mb-4 border-b border-outline-variant/20 pb-2">Technical Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter font-label-caps">
              <div className="p-4 bg-surface-low rounded-lg surface-rim">
                <p className="text-[10px] text-on-surface-variant opacity-70 uppercase">Duration</p>
                <p className="text-lg font-bold text-primary mt-1">{formatDuration(track.Milliseconds)}</p>
              </div>
              <div className="p-4 bg-surface-low rounded-lg surface-rim">
                <p className="text-[10px] text-on-surface-variant opacity-70 uppercase">File Size</p>
                <p className="text-lg font-bold text-secondary mt-1">{formatSize(track.Bytes)}</p>
              </div>
              <div className="p-4 bg-surface-low rounded-lg surface-rim">
                <p className="text-[10px] text-on-surface-variant opacity-70 uppercase">Price</p>
                <p className="text-lg font-bold text-success-vibrant mt-1">${track.UnitPrice?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="p-4 bg-surface-low rounded-lg surface-rim">
                <p className="text-[10px] text-on-surface-variant opacity-70 uppercase">Format</p>
                <p className="text-lg font-bold text-warning-vibrant mt-1">MPEG Audio</p>
              </div>
            </div>
          </div>

          {getToken() && (
            <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4">{t("track.listen")}</h4>
              <DeezerPlayer trackName={track.Name} artistName={artist?.Name} />
            </div>
          )}
        </div>

        <div className="space-y-stack-md">
          <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
            <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4">Album Context</h4>
            {album ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-4xl text-secondary">album</span>
                  <div>
                    <Link href={`/albums/${album.AlbumId}`} className="text-md font-bold text-on-surface hover:text-primary transition-colors block">{album.Title}</Link>
                    {artist && (
                      <Link href={`/artists/${artist.ArtistId}`} className="text-xs text-primary hover:underline">by {artist.Name}</Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-on-surface-variant text-sm italic">No album assigned (Single)</p>
            )}
          </div>

          <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
            <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4">Genre Classification</h4>
            {genre ? (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-secondary-container">library_music</span>
                <div>
                  <Link href={`/genres/${genre.GenreId}`} className="text-md font-bold text-on-surface hover:text-primary transition-colors">{genre.Name}</Link>
                  <p className="text-[10px] text-on-surface-variant opacity-50 mt-1">ID: {genre.GenreId}</p>
                </div>
              </div>
            ) : (
              <p className="text-on-surface-variant text-sm italic">No genre assigned</p>
            )}
          </div>

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
                <h3 className="text-lg font-bold text-on-surface">Delete Track?</h3>
                <p className="text-on-surface-variant text-sm mt-1">Are you sure you want to delete <strong>{track.Name}</strong>? This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all">Cancel</button>
              {isAdmin && <button onClick={handleDelete} className="px-4 py-2 bg-error-vibrant hover:bg-error-vibrant/90 text-white font-semibold rounded-lg cursor-pointer transition-all">Delete</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
