"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAllArtists, createAlbum } from "@/lib/db";
import type { ApiArtist, ApiAlbum } from "@/lib/db";
import { t } from "@/lib/i18n";

/*
  Página: Formulario para crear un nuevo álbum.
  Muestra un selector de artistas (cargado con getAllArtists).
  Al enviar, crea el álbum con createAlbum() y redirige
  a su detalle. Acepta ?artistId= en la URL para preseleccionar.
  El Suspense envuelve el contenido por el uso de useSearchParams.
*/
function AlbumFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedArtistId = searchParams.get("artistId") || "";

  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState("");
  const [artists, setArtists] = useState<ApiArtist[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await getAllArtists();
      setArtists(list);

      if (preselectedArtistId) {
        setArtistId(preselectedArtistId);
      } else if (list.length > 0) {
        setArtistId(list[0].ArtistId.toString());
      }
    })();
  }, [preselectedArtistId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError(t("albums.new.title_required"));
      return;
    }

    if (!artistId) {
      setError(t("albums.new.artist_required"));
      return;
    }

    setIsSubmitting(true);

    try {
      const newAlbum = await createAlbum({ Title: title.trim(), ArtistId: artistId ? parseInt(artistId) : undefined });
      router.push(`/albums/${newAlbum.AlbumId}`);
    } catch {
      setError(t("albums.new.error"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/albums" className="hover:text-primary transition-colors">{t("nav.albums")}</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{t("albums.new.breadcrumb")}</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">{t("albums.new.title")}</h2>
          <p className="text-on-surface-variant text-sm mt-1">{t("albums.new.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-lg">
          <div className="space-y-unit">
            <label htmlFor="album-title" className="block text-sm font-semibold text-on-surface">{t("albums.new.title_label")}</label>
            <input
              type="text"
              id="album-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder={t("albums.new.title_placeholder")}
            />
          </div>

          <div className="space-y-unit">
            <label htmlFor="album-artist" className="block text-sm font-semibold text-on-surface">{t("albums.new.artist_label")}</label>
            <select
              id="album-artist"
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all cursor-pointer"
            >
              <option value="" disabled>{t("albums.new.select_artist")}</option>
              {artists.map((artist) => (
                <option key={artist.ArtistId} value={artist.ArtistId}>{artist.Name}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-error-vibrant text-xs">{error}</p>}

          <div className="flex justify-end gap-3 pt-stack-md border-t border-outline-variant/20">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95">{t("confirm.cancel")}</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2">
              {isSubmitting ? t("albums.new.submitting") : t("albums.new.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewAlbum() {
  return (
    <Suspense fallback={<div className="text-center py-10 font-label-caps">{t("loading")}</div>}>
      <AlbumFormContent />
    </Suspense>
  );
}
