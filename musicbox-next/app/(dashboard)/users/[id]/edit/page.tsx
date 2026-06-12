"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllUsers, updateUser } from "@/lib/db";
import type { ApiUser } from "@/lib/db";
import { t } from "@/lib/i18n";

/*
  Página: Editar un usuario existente (solo admin).
  Carga todos los usuarios (getAllUsers) y encuentra el que
  coincide con params.id para prellenar el formulario.
  Al enviar, actualiza con updateUser().
  El admin "admin" no puede cambiar su propio username ni estado.
*/
export default function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const users = await getAllUsers();
        const data = users.find((u) => u.user_id === parseInt(id));
        if (!data) {
          router.push("/users");
          return;
        }
        setUsername(data.username || "");
        setEmail(data.email || "");
        setFullName(data.full_name || "");
        setIsActive(!data.disabled);
      } catch {
        router.push("/users");
      }
    })();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !fullName.trim()) {
      setError(t("users.edit.all_required"));
      return;
    }

    if (!email.includes("@")) {
      setError(t("users.edit.invalid_email"));
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUser(parseInt(id), {
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        disabled: !isActive,
      });
      router.push("/users");
    } catch {
      setError(t("users.edit.error"));
      setIsSubmitting(false);
    }
  };

  const isMainAdmin = username === "admin";

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/users" className="hover:text-primary transition-colors">{t("nav.users")}</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{t("users.edit.breadcrumb")}</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">{t("users.edit.title")}</h2>
          <p className="text-on-surface-variant text-sm mt-1">{t("users.edit.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <div className="space-y-unit">
            <label htmlFor="user-name" className="block text-sm font-semibold text-on-surface">{t("users.edit.full_name_label")}</label>
            <input type="text" id="user-name" value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder={t("users.edit.full_name_placeholder")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="space-y-unit">
              <label htmlFor="user-username" className="block text-sm font-semibold text-on-surface">{t("users.edit.username_label")}</label>
              <input type="text" id="user-username" disabled={isMainAdmin} value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all disabled:opacity-50"
                placeholder={t("users.edit.username_placeholder")} />
            </div>
            <div className="space-y-unit">
              <label htmlFor="user-email" className="block text-sm font-semibold text-on-surface">{t("users.edit.email_label")}</label>
              <input type="email" id="user-email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                placeholder={t("users.edit.email_placeholder")} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input type="checkbox" id="user-active" disabled={isMainAdmin} checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-primary-container border-outline-variant/30 bg-surface-high focus:ring-primary-container focus:ring-1 cursor-pointer disabled:opacity-50" />
            <label htmlFor="user-active" className="text-sm text-on-surface cursor-pointer select-none">{t("users.edit.active_label")}</label>
          </div>

          {error && <p className="text-error-vibrant text-xs pt-2">{error}</p>}

          <div className="flex justify-end gap-3 pt-stack-md border-t border-outline-variant/20">
            <Link href="/users">
              <button type="button" className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95">{t("confirm.cancel")}</button>
            </Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2">
              {isSubmitting ? t("users.edit.submitting") : t("users.edit.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
