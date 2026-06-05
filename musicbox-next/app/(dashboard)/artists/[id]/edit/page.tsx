"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getById, update, getImageUrl, uploadImage } from "@/lib/db";
import type { ApiArtist } from "@/lib/db";

export default function EditArtist({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getById<ApiArtist>("artists", parseInt(id));
      if (!data) {
        router.push("/artists");
        return;
      }
      setName(data.Name);
      setImageUrl(data.ImageUrl || null);
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

    if (!name.trim()) {
      setError("Artist name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await update<ApiArtist>("artists", parseInt(id), { Name: name.trim() });

      if (imageFile) {
        await uploadImage("artists", parseInt(id), imageFile);
      }

      router.push("/artists");
    } catch {
      setError("Failed to update artist. Please try again.");
      setIsSubmitting(false);
    }
  };

  const currentPreview = imagePreview || getImageUrl(imageUrl);

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/artists" className="hover:text-primary transition-colors">Artists</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{name || "Artist Detail"}</span>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">Edit</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">Edit Artist</h2>
          <p className="text-on-surface-variant text-sm mt-1">Modify artist credentials and catalog profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-lg">
          <div className="flex items-center gap-6">
            {currentPreview ? (
              <img src={currentPreview} alt={name}
                className="w-20 h-20 rounded-full object-cover border-2 border-primary/30" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">person</span>
              </div>
            )}
            <div className="flex-1">
              <label htmlFor="artist-image" className="block text-sm font-semibold text-on-surface mb-1">
                Artist Image
              </label>
              <input
                type="file"
                id="artist-image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-on-surface-variant file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary cursor-pointer file:cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-unit">
            <label htmlFor="artist-name" className="block text-sm font-semibold text-on-surface">Artist Name</label>
            <input
              type="text"
              id="artist-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full bg-surface-high border ${error ? "border-error-vibrant" : "border-outline-variant/30"} rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all`}
              placeholder="e.g. Elena Void, The Midnight, M83"
            />
            {error && <p className="text-error-vibrant text-xs mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-stack-md border-t border-outline-variant/20">
            <Link href="/artists">
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
