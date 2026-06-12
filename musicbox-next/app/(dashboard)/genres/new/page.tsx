"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createGenre } from "@/lib/db";
import { t } from "@/lib/i18n";

/*
  Página: Formulario para crear un nuevo género.
  Solo requiere el nombre. Al enviar, usa createGenre()
  y redirige a la lista de géneros.
*/
export default function NewGenre() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError(t("genres.new.name_required"));
      return;
    }

    setIsSubmitting(true);

    try {
      await createGenre({ Name: name.trim() });
      router.push("/genres");
    } catch {
      setError(t("genres.new.error"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/genres" className="hover:text-primary transition-colors">{t("nav.genres")}</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{t("genres.new.breadcrumb")}</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">{t("genres.new.title")}</h2>
          <p className="text-on-surface-variant text-sm mt-1">{t("genres.new.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-lg">
          <div className="space-y-unit">
            <label htmlFor="genre-name" className="block text-sm font-semibold text-on-surface">{t("genres.new.name_label")}</label>
            <input
              type="text"
              id="genre-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder={t("genres.new.name_placeholder")}
            />
            {error && <p className="text-error-vibrant text-xs mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-stack-md border-t border-outline-variant/20">
            <Link href="/genres">
              <button type="button" className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95">{t("confirm.cancel")}</button>
            </Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2">
              {isSubmitting ? t("genres.new.submitting") : t("genres.new.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
