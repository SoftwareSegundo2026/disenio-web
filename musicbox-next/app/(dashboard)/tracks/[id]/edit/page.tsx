"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getById, getAll, update } from "@/lib/db";
import type { ApiTrack, ApiAlbum, ApiGenre } from "@/lib/db";

export default function EditTrack({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

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
      const data = await getById<ApiTrack>("tracks", parseInt(id));
      if (!data) {
        router.push("/tracks");
        return;
      }

      setName(data.Name || "");
      setAlbumId(data.AlbumId?.toString() || "");
      setGenreId(data.GenreId?.toString() || "");
      setComposer(data.Composer || "");

      if (data.Milliseconds) {
        const totalSecs = Math.floor(data.Milliseconds / 1000);
        setMinutes(Math.floor(totalSecs / 60).toString());
        setSeconds((totalSecs % 60).toString().padStart(2, "0"));
      }

      if (data.Bytes) {
        const mb = data.Bytes / (1024 * 1024);
        setFileSizeMB(mb.toFixed(1));
      }

      setUnitPrice(data.UnitPrice?.toString() || "0.99");

      const albumList = await getAll<ApiAlbum>("albums");
      const genreList = await getAll<ApiGenre>("genres");
      setAlbums(albumList);
      setGenres(genreList);
    };
    loadData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Track name is required");
      return;
    }

    const minVal = parseInt(minutes, 10);
    const secVal = parseInt(seconds, 10);
    if (isNaN(minVal) || isNaN(secVal) || secVal < 0 || secVal > 59) {
      setError("Invalid duration format (seconds must be between 0 and 59)");
      return;
    }

    const priceVal = parseFloat(unitPrice);
    if (isNaN(priceVal) || priceVal < 0) {
      setError("Invalid unit price");
      return;
    }

    const sizeVal = parseFloat(fileSizeMB);
    if (isNaN(sizeVal) || sizeVal < 0) {
      setError("Invalid file size");
      return;
    }

    setIsSubmitting(true);

    try {
      const milliseconds = (minVal * 60 + secVal) * 1000;
      const bytes = Math.round(sizeVal * 1024 * 1024);

      await update("tracks", parseInt(id), {
        Name: name.trim(),
        AlbumId: albumId ? parseInt(albumId) : null,
        GenreId: genreId ? parseInt(genreId) : null,
        Composer: composer.trim() || null,
        Milliseconds: milliseconds,
        Bytes: bytes,
        UnitPrice: priceVal,
        MediaTypeId: 1,
      });

      router.push("/tracks");
    } catch {
      setError("Failed to update track. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/tracks" className="hover:text-primary transition-colors">Tracks</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{name || "Track Detail"}</span>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">Edit</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">Edit Track</h2>
          <p className="text-on-surface-variant text-sm mt-1">Modify track technical specs and metadata properties</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <div className="space-y-unit">
            <label htmlFor="track-name" className="block text-sm font-semibold text-on-surface">Track Name</label>
            <input type="text" id="track-name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder="e.g. Midnight City (Remix), Deep Sea Blue" />
          </div>

          <div className="space-y-unit">
            <label htmlFor="track-composer" className="block text-sm font-semibold text-on-surface">Composer</label>
            <input type="text" id="track-composer" value={composer} onChange={(e) => setComposer(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder="Composer name" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="space-y-unit">
              <label htmlFor="track-album" className="block text-sm font-semibold text-on-surface">Album</label>
              <select id="track-album" value={albumId} onChange={(e) => setAlbumId(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all cursor-pointer">
                <option value="">None (Single Release)</option>
                {albums.map((album) => (
                  <option key={album.AlbumId} value={album.AlbumId}>{album.Title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-unit">
              <label htmlFor="track-genre" className="block text-sm font-semibold text-on-surface">Genre</label>
              <select id="track-genre" value={genreId} onChange={(e) => setGenreId(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all cursor-pointer">
                <option value="">None</option>
                {genres.map((genre) => (
                  <option key={genre.GenreId} value={genre.GenreId}>{genre.Name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-gutter">
            <div className="space-y-unit">
              <label className="block text-sm font-semibold text-on-surface">Duration (MM:SS)</label>
              <div className="flex gap-1 items-center bg-surface-high border border-outline-variant/30 rounded-lg px-2">
                <input type="number" min="0" value={minutes} onChange={(e) => setMinutes(e.target.value)}
                  className="w-full bg-transparent border-none py-2 text-center text-body-md text-on-surface focus:ring-0 focus:outline-none" placeholder="Min" />
                <span className="text-on-surface-variant font-bold">:</span>
                <input type="number" min="0" max="59" value={seconds} onChange={(e) => setSeconds(e.target.value)}
                  className="w-full bg-transparent border-none py-2 text-center text-body-md text-on-surface focus:ring-0 focus:outline-none" placeholder="Sec" />
              </div>
            </div>
            <div className="space-y-unit">
              <label htmlFor="track-size" className="block text-sm font-semibold text-on-surface">Size (MB)</label>
              <input type="number" id="track-size" step="0.1" min="0" value={fileSizeMB} onChange={(e) => setFileSizeMB(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all text-center" />
            </div>
            <div className="space-y-unit">
              <label htmlFor="track-price" className="block text-sm font-semibold text-on-surface">Price ($)</label>
              <input type="number" id="track-price" step="0.01" min="0" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all text-center" />
            </div>
          </div>

          {error && <p className="text-error-vibrant text-xs pt-2">{error}</p>}

          <div className="flex justify-end gap-3 pt-stack-md border-t border-outline-variant/20">
            <Link href="/tracks">
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
