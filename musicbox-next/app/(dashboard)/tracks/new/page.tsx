"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAllAlbums, getAllGenres, createTrack } from "@/lib/db";
import type { ApiAlbum, ApiGenre } from "@/lib/db";
import { t } from "@/lib/i18n";

/*
  Página: Formulario para crear una nueva canción.
  Carga álbumes (getAllAlbums) y géneros (getAllGenres) para
  los selectores. Calcula duración en ms y bytes desde inputs
  amigables (minutos:segundos, MB). Acepta ?albumId= para
  preseleccionar. El Suspense envuelve por useSearchParams.
*/
function TrackFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedAlbumId = searchParams.get("albumId") || "";

  const [name, setName] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [genreId, setGenreId] = useState("");
  const [composer, setComposer] = useState("");
  const [minutes, setMinutes] = useState("3");
  const [seconds, setSeconds] = useState("00");
  const [fileSizeMB, setFileSizeMB] = useState("8.5");
  const [unitPrice, setUnitPrice] = useState("0.99");

  const [albums, setAlbums] = useState<ApiAlbum[]>([]);
  const [genres, setGenres] = useState<ApiGenre[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const albumList = await getAllAlbums();
      const genreList = await getAllGenres();
      setAlbums(albumList);
      setGenres(genreList);

      if (preselectedAlbumId) {
        setAlbumId(preselectedAlbumId);
      } else if (albumList.length > 0) {
        setAlbumId(albumList[0].AlbumId.toString());
      }

      if (genreList.length > 0) {
        setGenreId(genreList[0].GenreId.toString());
      }
    };
    loadData();
  }, [preselectedAlbumId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError(t("tracks.new.name_required"));
      return;
    }

    const minVal = parseInt(minutes, 10);
    const secVal = parseInt(seconds, 10);
    if (isNaN(minVal) || isNaN(secVal) || secVal < 0 || secVal > 59) {
      setError(t("tracks.new.invalid_duration"));
      return;
    }

    const priceVal = parseFloat(unitPrice);
    if (isNaN(priceVal) || priceVal < 0) {
      setError(t("tracks.new.invalid_price"));
      return;
    }

    const sizeVal = parseFloat(fileSizeMB);
    if (isNaN(sizeVal) || sizeVal < 0) {
      setError(t("tracks.new.invalid_size"));
      return;
    }

    setIsSubmitting(true);

    try {
      const milliseconds = (minVal * 60 + secVal) * 1000;
      const bytes = Math.round(sizeVal * 1024 * 1024);

      await createTrack({
        Name: name.trim(),
        AlbumId: albumId ? parseInt(albumId) : null,
        GenreId: genreId ? parseInt(genreId) : null,
        Composer: composer.trim() || null,
        Milliseconds: milliseconds,
        Bytes: bytes,
        UnitPrice: priceVal,
        MediaTypeId: 1,
      });

      if (albumId) {
        router.push(`/albums/${albumId}`);
      } else {
        router.push("/tracks");
      }
    } catch {
      setError(t("tracks.new.error"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/tracks" className="hover:text-primary transition-colors">{t("nav.tracks")}</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{t("tracks.new.breadcrumb")}</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">{t("tracks.new.title")}</h2>
          <p className="text-on-surface-variant text-sm mt-1">{t("tracks.new.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <div className="space-y-unit">
            <label htmlFor="track-name" className="block text-sm font-semibold text-on-surface">{t("tracks.new.name_label")}</label>
            <input type="text" id="track-name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder={t("tracks.new.name_placeholder")} />
          </div>

          <div className="space-y-unit">
            <label htmlFor="track-composer" className="block text-sm font-semibold text-on-surface">{t("tracks.new.composer_label")}</label>
            <input type="text" id="track-composer" value={composer} onChange={(e) => setComposer(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder={t("tracks.new.composer_placeholder")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="space-y-unit">
              <label htmlFor="track-album" className="block text-sm font-semibold text-on-surface">{t("list.album")}</label>
              <select id="track-album" value={albumId} onChange={(e) => setAlbumId(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all cursor-pointer">
                <option value="">{t("tracks.new.no_album_option")}</option>
                {albums.map((album) => (
                  <option key={album.AlbumId} value={album.AlbumId}>{album.Title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-unit">
              <label htmlFor="track-genre" className="block text-sm font-semibold text-on-surface">{t("list.genre")}</label>
              <select id="track-genre" value={genreId} onChange={(e) => setGenreId(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all cursor-pointer">
                <option value="">{t("tracks.new.no_genre_option")}</option>
                {genres.map((genre) => (
                  <option key={genre.GenreId} value={genre.GenreId}>{genre.Name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-gutter">
            <div className="space-y-unit">
              <label className="block text-sm font-semibold text-on-surface">{t("tracks.new.duration_label")}</label>
              <div className="flex gap-1 items-center bg-surface-high border border-outline-variant/30 rounded-lg px-2">
                <input type="number" min="0" value={minutes} onChange={(e) => setMinutes(e.target.value)}
                  className="w-full bg-transparent border-none py-2 text-center text-body-md text-on-surface focus:ring-0 focus:outline-none" placeholder="Min" />
                <span className="text-on-surface-variant font-bold">:</span>
                <input type="number" min="0" max="59" value={seconds} onChange={(e) => setSeconds(e.target.value)}
                  className="w-full bg-transparent border-none py-2 text-center text-body-md text-on-surface focus:ring-0 focus:outline-none" placeholder="Sec" />
              </div>
            </div>
            <div className="space-y-unit">
              <label htmlFor="track-size" className="block text-sm font-semibold text-on-surface">{t("tracks.new.size_label")}</label>
              <input type="number" id="track-size" step="0.1" min="0" value={fileSizeMB} onChange={(e) => setFileSizeMB(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all text-center" />
            </div>
            <div className="space-y-unit">
              <label htmlFor="track-price" className="block text-sm font-semibold text-on-surface">{t("tracks.new.price_label")}</label>
              <input type="number" id="track-price" step="0.01" min="0" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all text-center" />
            </div>
          </div>

          {error && <p className="text-error-vibrant text-xs pt-2">{error}</p>}

          <div className="flex justify-end gap-3 pt-stack-md border-t border-outline-variant/20">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95">{t("confirm.cancel")}</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2">
              {isSubmitting ? t("tracks.new.submitting") : t("tracks.new.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewTrack() {
  return (
    <Suspense fallback={<div className="text-center py-10 font-label-caps">{t("loading")}</div>}>
      <TrackFormContent />
    </Suspense>
  );
}
