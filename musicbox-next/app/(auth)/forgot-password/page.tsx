"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { t } from "@/lib/i18n";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError(t("forgot.email_required"));
      return;
    }

    if (!email.includes("@")) {
      setError(t("forgot.invalid_email"));
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }, 1000);
  };

  if (success) {
    return (
      <div className="bg-surface-medium surface-rim p-gutter rounded-xl text-center space-y-stack-md shadow-2xl animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-success-vibrant/20 text-success-vibrant flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">mail</span>
        </div>
        <h2 className="text-xl font-bold text-on-surface">{t("forgot.success_title")}</h2>
        <p className="text-on-surface-variant text-sm">
          {t("forgot.success_text", { email })}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-medium surface-rim p-gutter rounded-xl space-y-stack-lg shadow-2xl animate-fadeIn">
      <div className="text-center">
        <h1 className="font-display-lg text-headline-lg font-bold text-primary">Sonance</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant opacity-75 mt-1">
          {t("forgot.title")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-stack-md">
        <div className="space-y-unit">
          <label htmlFor="recovery-email" className="block text-sm font-semibold text-on-surface">
            {t("forgot.email_label")}
          </label>
          <input
            type="email"
            id="recovery-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container transition-all"
            placeholder={t("forgot.email_placeholder")}
          />
        </div>

        {error && <p className="text-error-vibrant text-xs text-center">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold py-2.5 rounded-lg cursor-pointer transition-all active:scale-[0.99] flex justify-center items-center gap-2"
        >
          {isSubmitting ? t("forgot.submitting") : t("forgot.submit")}
        </button>
      </form>

      <div className="text-center pt-stack-md border-t border-outline-variant/10 text-sm text-on-surface-variant">
        {t("forgot.remember")}{" "}
        <Link href="/login" className="text-primary hover:underline font-semibold">
          {t("forgot.login_link")}
        </Link>
      </div>
    </div>
  );
}
