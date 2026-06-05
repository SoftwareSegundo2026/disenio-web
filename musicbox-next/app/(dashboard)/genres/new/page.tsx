"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { create } from "@/lib/db";

export default function NewGenre() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Genre name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await create("genres", { Name: name.trim() });
      router.push("/genres");
    } catch {
      setError("Failed to create genre. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/genres" className="hover:text-primary transition-colors">Genres</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">New Genre</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">Add New Genre</h2>
          <p className="text-on-surface-variant text-sm mt-1">Register a new music classification category</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-lg">
          <div className="space-y-unit">
            <label htmlFor="genre-name" className="block text-sm font-semibold text-on-surface">Genre Name</label>
            <input
              type="text"
              id="genre-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder="e.g. Dream Pop, Synthwave, Techno, Jazz"
            />
            {error && <p className="text-error-vibrant text-xs mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-stack-md border-t border-outline-variant/20">
            <Link href="/genres">
              <button type="button" className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95">Cancel</button>
            </Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2">
              {isSubmitting ? "Creating..." : "Create Genre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
