"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAll, create } from "@/lib/db";
import type { ApiArtist, ApiAlbum } from "@/lib/db";

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
      const list = await getAll("artists") as ApiArtist[];
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
      setError("Album title is required");
      return;
    }

    if (!artistId) {
      setError("Please select an artist");
      return;
    }

    setIsSubmitting(true);

    try {
      const newAlbum = await create("albums", { Title: title.trim(), ArtistId: artistId ? parseInt(artistId) : undefined }) as ApiAlbum;
      router.push(`/albums/${newAlbum.AlbumId}`);
    } catch {
      setError("Failed to create album. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/albums" className="hover:text-primary transition-colors">Albums</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">New Album</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">Add New Album</h2>
          <p className="text-on-surface-variant text-sm mt-1">Register a new album catalog record</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-lg">
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
            <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2">
              {isSubmitting ? "Creating..." : "Create Album"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewAlbum() {
  return (
    <Suspense fallback={<div className="text-center py-10 font-label-caps">Loading form...</div>}>
      <AlbumFormContent />
    </Suspense>
  );
}
