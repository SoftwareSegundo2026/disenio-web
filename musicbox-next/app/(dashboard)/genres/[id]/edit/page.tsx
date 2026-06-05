"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getById, update } from "@/lib/db";
import type { ApiGenre } from "@/lib/db";
import { t } from "@/lib/i18n";

export default function EditGenre({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getById<ApiGenre>("genres", parseInt(id));
      if (!data) {
        router.push("/genres");
        return;
      }
      setName(data.Name);
    };
    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError(t("genres.edit.name_required"));
      return;
    }

    setIsSubmitting(true);

    try {
      await update("genres", parseInt(id), { Name: name.trim() });
      router.push("/genres");
    } catch {
      setError(t("genres.edit.error"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/genres" className="hover:text-primary transition-colors">{t("nav.genres")}</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{name || t("genres.edit.detail_fallback")}</span>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{t("genres.edit.breadcrumb")}</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">{t("genres.edit.title")}</h2>
          <p className="text-on-surface-variant text-sm mt-1">{t("genres.edit.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-lg">
          <div className="space-y-unit">
            <label htmlFor="genre-name" className="block text-sm font-semibold text-on-surface">{t("genres.edit.name_label")}</label>
            <input
              type="text"
              id="genre-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder={t("genres.edit.name_placeholder")}
            />
            {error && <p className="text-error-vibrant text-xs mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-stack-md border-t border-outline-variant/20">
            <Link href="/genres">
              <button type="button" className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95">{t("confirm.cancel")}</button>
            </Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2">
              {isSubmitting ? t("genres.edit.submitting") : t("genres.edit.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
