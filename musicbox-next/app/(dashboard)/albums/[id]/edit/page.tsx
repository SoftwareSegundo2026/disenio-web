"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getById, getAll, update, getImageUrl, uploadImage } from "@/lib/db";
import type { ApiAlbum, ApiArtist } from "@/lib/db";

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
      const data = await getById("albums", parseInt(id)) as ApiAlbum;
      if (!data) {
        router.push("/albums");
        return;
      }
      setTitle(data.Title);
      setArtistId(data.ArtistId?.toString() || "");
      setImageUrl(data.ImageUrl || null);

      const list = await getAll("artists") as ApiArtist[];
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
      setError("Album title is required");
      return;
    }

    if (!artistId) {
      setError("Please select an artist");
      return;
    }

    setIsSubmitting(true);

    try {
      await update("albums", parseInt(id), { Title: title.trim(), ArtistId: artistId ? parseInt(artistId) : undefined });

      if (imageFile) {
        await uploadImage("albums", parseInt(id), imageFile);
      }

      router.push("/albums");
    } catch {
      setError("Failed to update album. Please try again.");
      setIsSubmitting(false);
    }
  };

  const currentPreview = imagePreview || getImageUrl(imageUrl);

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/albums" className="hover:text-primary transition-colors">Albums</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{title || "Album Detail"}</span>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">Edit</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">Edit Album</h2>
          <p className="text-on-surface-variant text-sm mt-1">Modify album credentials and catalog mappings</p>
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
                Album Cover
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
            <label htmlFor="album-title" className="block text-sm font-semibold text-on-surface">Album Title</label>
            <input
              type="text"
              id="album-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder="e.g. Hurry Up, We're Dreaming, Solar Echoes"
            />
          </div>

          <div className="space-y-unit">
            <label htmlFor="album-artist" className="block text-sm font-semibold text-on-surface">Artist</label>
            <select
              id="album-artist"
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all cursor-pointer"
            >
              <option value="" disabled>Select an artist...</option>
              {artists.map((artist) => (
                <option key={artist.ArtistId} value={artist.ArtistId}>{artist.Name}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-error-vibrant text-xs">{error}</p>}

          <div className="flex justify-end gap-3 pt-stack-md border-t border-outline-variant/20">
            <Link href="/albums">
              <button type="button" className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95">Cancel</button>
            </Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
