"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginApi } from "@/lib/db";
import { t } from "@/lib/i18n";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError(t("login.validation"));
      return;
    }

    setIsSubmitting(true);

    try {
      await loginApi({ username: username.trim(), password });
      router.push("/");
    } catch {
      setError(t("login.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-medium surface-rim p-gutter rounded-xl space-y-stack-lg shadow-2xl animate-fadeIn">
      <div className="text-center">
        <h1 className="font-display-lg text-headline-lg font-bold text-primary">Sonance</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant opacity-75 mt-1">
          {t("app.subtitle")}
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-stack-md">
        <div className="space-y-unit">
          <label htmlFor="auth-username" className="block text-sm font-semibold text-on-surface">
            {t("login.username_label")}
          </label>
          <input
            type="text"
            id="auth-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
            placeholder={t("login.username_placeholder")}
          />
        </div>

        <div className="space-y-unit">
          <div className="flex justify-between items-center">
            <label htmlFor="auth-pass" className="block text-sm font-semibold text-on-surface">
              {t("login.password_label")}
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline font-medium"
            >
              {t("login.forgot")}
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              id="auth-pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 pr-10 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder={t("login.password_placeholder")}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer">
              <span className="material-symbols-outlined text-lg">{showPass ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        {error && <p className="text-error-vibrant text-xs text-center">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold py-2.5 rounded-lg cursor-pointer transition-all active:scale-[0.99] flex justify-center items-center gap-2"
        >
          {isSubmitting ? t("login.submitting") : t("login.title")}
        </button>
      </form>

      <div className="text-center pt-stack-md border-t border-outline-variant/10 text-sm text-on-surface-variant">
        {t("login.no_account")}{" "}
        <Link href="/register" className="text-primary hover:underline font-semibold">
          {t("login.create_account")}
        </Link>
      </div>
    </div>
  );
}
