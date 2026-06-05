"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { create } from "@/lib/db";

export default function NewArtist() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Artist name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await create("artists", { Name: name.trim() });
      router.push("/artists");
    } catch {
      setError("Failed to create artist. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/artists" className="hover:text-primary transition-colors">Artists</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">New Artist</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">Add New Artist</h2>
          <p className="text-on-surface-variant text-sm mt-1">Register a new music creator in the catalog system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-lg">
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
              {isSubmitting ? "Creating..." : "Create Artist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
