"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAlbumById, getAllArtists, updateAlbum, getImageUrl, uploadAlbumImage } from "@/lib/db";
import type { ApiAlbum, ApiArtist } from "@/lib/db";
import { t } from "@/lib/i18n";

/*
  Página: Editar un álbum existente.
  Carga datos actuales (getAlbumById) y lista de artistas
  (getAllArtists) para el selector. Al enviar, actualiza
  con updateAlbum() y opcionalmente sube imagen.
*/
export default function EditAlbum({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState("");
  const [artists, setArtists] = useState<ApiArtist[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getAlbumById(parseInt(id));
      if (!data) {
        router.push("/albums");
        return;
      }
      setTitle(data.Title);
      setArtistId(data.ArtistId?.toString() || "");
      setImageUrl(data.ImageUrl || null);

      const list = await getAllArtists();
      setArtists(list);
    })();
  }, [id, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError(t("albums.edit.title_required"));
      return;
    }

    if (!artistId) {
      setError(t("albums.edit.artist_required"));
      return;
    }

    setIsSubmitting(true);

    try {
      await updateAlbum(parseInt(id), { Title: title.trim(), ArtistId: artistId ? parseInt(artistId) : undefined });

      if (imageFile) {
        await uploadAlbumImage(parseInt(id), imageFile);
      }

      router.push("/albums");
    } catch {
      setError(t("albums.edit.error"));
      setIsSubmitting(false);
    }
  };

  const currentPreview = imagePreview || getImageUrl(imageUrl);

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/albums" className="hover:text-primary transition-colors">{t("nav.albums")}</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{title || t("albums.edit.detail_fallback")}</span>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{t("albums.edit.breadcrumb")}</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">{t("albums.edit.title")}</h2>
          <p className="text-on-surface-variant text-sm mt-1">{t("albums.edit.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-lg">
          <div className="flex items-center gap-6">
            {currentPreview ? (
              <img src={currentPreview} alt={title}
                className="w-20 h-20 rounded-xl object-cover border-2 border-primary/30" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <span className="material-symbols-outlined text-4xl text-secondary">album</span>
              </div>
            )}
            <div className="flex-1">
              <label htmlFor="album-image" className="block text-sm font-semibold text-on-surface mb-1">
                {t("albums.edit.cover_label")}
              </label>
              <input
                type="file"
                id="album-image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-on-surface-variant file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary cursor-pointer file:cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-unit">
            <label htmlFor="album-title" className="block text-sm font-semibold text-on-surface">{t("albums.edit.title_label")}</label>
            <input
              type="text"
              id="album-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder={t("albums.edit.title_placeholder")}
            />
          </div>

          <div className="space-y-unit">
            <label htmlFor="album-artist" className="block text-sm font-semibold text-on-surface">{t("albums.edit.artist_label")}</label>
            <select
              id="album-artist"
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all cursor-pointer"
            >
              <option value="" disabled>{t("albums.edit.select_artist")}</option>
              {artists.map((artist) => (
                <option key={artist.ArtistId} value={artist.ArtistId}>{artist.Name}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-error-vibrant text-xs">{error}</p>}

          <div className="flex justify-end gap-3 pt-stack-md border-t border-outline-variant/20">
            <Link href="/albums">
              <button type="button" className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95">{t("confirm.cancel")}</button>
            </Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2">
              {isSubmitting ? t("albums.edit.submitting") : t("albums.edit.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
