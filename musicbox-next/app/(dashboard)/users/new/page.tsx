"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUser, getTokenValue } from "@/lib/db";
import { t } from "@/lib/i18n";

/*
  Página: Formulario para crear un nuevo usuario (solo admin).
  Requiere token (getTokenValue) para poder crear. Envía
  username, email, full_name y password con createUser().
  Redirige a la lista al completar.
*/
export default function NewUser() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !fullName.trim() || !password) {
      setError(t("users.new.all_required"));
      return;
    }

    if (!email.includes("@")) {
      setError(t("users.new.invalid_email"));
      return;
    }

    const token = getTokenValue();
    if (!token) {
      setError(t("users.new.no_token"));
      return;
    }

    setIsSubmitting(true);

    try {
      await createUser({
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        password,
      });
      router.push("/users");
    } catch {
      setError(t("users.new.error"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-stack-md animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label-caps">
        <Link href="/users" className="hover:text-primary transition-colors">{t("nav.users")}</Link>
        <span className="text-primary font-bold">/</span>
        <span className="text-on-surface opacity-75">{t("users.new.breadcrumb")}</span>
      </div>

      <div className="bg-surface-medium surface-rim p-gutter rounded-xl">
        <div className="border-b border-outline-variant/20 pb-stack-md mb-stack-lg">
          <h2 className="text-headline-lg font-bold text-on-surface">{t("users.new.title")}</h2>
          <p className="text-on-surface-variant text-sm mt-1">{t("users.new.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <div className="space-y-unit">
            <label htmlFor="user-name" className="block text-sm font-semibold text-on-surface">{t("users.new.full_name_label")}</label>
            <input type="text" id="user-name" value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder={t("users.new.full_name_placeholder")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="space-y-unit">
              <label htmlFor="user-username" className="block text-sm font-semibold text-on-surface">{t("users.new.username_label")}</label>
              <input type="text" id="user-username" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                placeholder={t("users.new.username_placeholder")} />
            </div>
            <div className="space-y-unit">
              <label htmlFor="user-email" className="block text-sm font-semibold text-on-surface">{t("users.new.email_label")}</label>
              <input type="email" id="user-email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                placeholder={t("users.new.email_placeholder")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="space-y-unit">
              <label htmlFor="user-pass" className="block text-sm font-semibold text-on-surface">{t("users.new.password_label")}</label>
              <input type="password" id="user-pass" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                placeholder="••••••••" />
            </div>
          </div>

          {error && <p className="text-error-vibrant text-xs pt-2">{error}</p>}

          <div className="flex justify-end gap-3 pt-stack-md border-t border-outline-variant/20">
            <Link href="/users">
              <button type="button" className="px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95">{t("confirm.cancel")}</button>
            </Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2">
              {isSubmitting ? t("users.new.submitting") : t("users.new.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
