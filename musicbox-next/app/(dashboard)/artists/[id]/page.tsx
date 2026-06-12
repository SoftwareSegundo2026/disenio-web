"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getArtistById, getAllAlbums, deleteArtist, getImageUrl } from "@/lib/db";
import type { ApiArtist, ApiAlbum } from "@/lib/db";
import { t } from "@/lib/i18n";
import { getIsAdmin } from "@/lib/db";

/*
  Página: Detalle de un artista.
  Muestra su nombre, imagen (si tiene) y una tabla con sus álbumes.
  Carga el artista con getArtistById() y todos los álbumes con
  getAllAlbums(), filtrando los que pertenecen a este artista.
  El admin puede eliminar el artista desde aquí.
  params.id se resuelve con use() (patrón Next.js 16).
*/
export default function ArtistDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [artist, setArtist] = useState<ApiArtist | null>(null);
  const [albums, setAlbums] = useState<ApiAlbum[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isAdmin = getIsAdmin();

  useEffect(() => {
    (async () => {
      const data = await getArtistById(parseInt(id));
      if (!data) {
        router.push("/artists");
        return;
      }
      setArtist(data);
      const allAlbums = await getAllAlbums();
      const artistAlbums = allAlbums.filter((album: ApiAlbum) => album.ArtistId === parseInt(id));
      setAlbums(artistAlbums);
    })();
  }, [id, router]);

  const handleDelete = async () => {
    await deleteArtist(parseInt(id));
    router.push("/artists");
  };

  if (!artist) {
    return (
      <div className="flex justify-center items-center h-64 text-on-surface-variant font-label-caps animate-pulse">
        {t("artist.loading")}
      </div>
    );
  }

  return (
    <div className="space-y-stack-lg animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/artists" className="hover:text-primary transition-colors">{t("page.artists")}</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{artist.Name}</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl flex justify-between items-center">
        <div className="flex items-center gap-6">
          {getImageUrl(artist.ImageUrl) ? (
            <img src={getImageUrl(artist.ImageUrl)!} alt={artist.Name}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary/30" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">person</span>
            </div>
          )}
          <div>
            <h2 className="text-headline-lg font-bold text-on-surface">{artist.Name}</h2>
            <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">{t("track.id", { id: artist.ArtistId })}</p>
          </div>
        </div>

      </div>

      <div className="bg-surface-medium surface-rim rounded-xl overflow-hidden">
        <div className="p-gutter border-b border-outline-variant/20 flex justify-between items-center">
          <h3 className="text-headline-md font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">album</span>{t("artist.albums", { count: albums.length })}
          </h3>
          {isAdmin && (
            <Link href={`/albums/new?artistId=${id}`}>
              <button className="bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 font-bold py-1.5 px-4 rounded-lg flex items-center gap-2 cursor-pointer transition-all text-sm active:scale-95">
                <span className="material-symbols-outlined text-sm">library_add</span>{t("artist.create_album")}
              </button>
            </Link>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-low/50">
                <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.id")}</th>
                <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.title")}</th>
                <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase text-right">{t("list.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {albums.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-gutter py-12 text-center text-on-surface-variant">{t("artist.no_albums")}</td>
                </tr>
              ) : (
                albums.map((album) => (
                  <tr key={album.AlbumId} className="hover:bg-surface-high transition-colors group">
                    <td className="px-gutter py-stack-md font-label-caps text-label-caps text-secondary opacity-70">{album.AlbumId}</td>
                    <td className="px-gutter py-stack-md font-medium text-on-surface">{album.Title}</td>
                    <td className="px-gutter py-stack-md text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/albums/${album.AlbumId}`}>
                          <button className="p-1 hover:text-primary transition-colors cursor-pointer" title={t("list.view_details")}>
                            <span className="material-symbols-outlined text-xl">visibility</span>
                          </button>
                        </Link>
                        {isAdmin && (
                          <Link href={`/albums/${album.AlbumId}/edit`}>
                            <button className="p-1 hover:text-secondary transition-colors cursor-pointer" title={t("list.edit")}>
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                          </Link>
                        )}
                      </div>
                    </td>
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
                <h3 className="text-lg font-bold text-on-surface">{t("confirm.delete_title", { item: "Artist" })}</h3>
                <p className="text-on-surface-variant text-sm mt-1">{t("confirm.delete_text", { name: artist.Name })}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all">{t("confirm.cancel")}</button>
              {isAdmin && <button onClick={handleDelete} className="px-4 py-2 bg-error-vibrant hover:bg-error-vibrant/90 text-white font-semibold rounded-lg cursor-pointer transition-all">{t("confirm.delete")}</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
