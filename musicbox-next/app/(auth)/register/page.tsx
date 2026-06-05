"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { create, getTokenValue } from "@/lib/db";
import { t } from "@/lib/i18n";

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      setError(t("register.all_required"));
      return;
    }

    if (!email.includes("@")) {
      setError(t("register.invalid_email"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("register.password_mismatch"));
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getTokenValue();
      if (!token) {
        setError(t("register.no_token"));
        setIsSubmitting(false);
        return;
      }

      await create("users", {
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        password,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/users");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("register.error"));
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-surface-medium surface-rim p-gutter rounded-xl text-center space-y-stack-md shadow-2xl animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-success-vibrant/20 text-success-vibrant flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">check_circle</span>
        </div>
        <h2 className="text-xl font-bold text-on-surface">{t("register.success_title")}</h2>
        <p className="text-on-surface-variant text-sm">
          {t("register.success_text")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-medium surface-rim p-gutter rounded-xl space-y-stack-lg shadow-2xl animate-fadeIn">
      <div className="text-center">
        <h1 className="font-display-lg text-headline-lg font-bold text-primary">Sonance</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant opacity-75 mt-1">
          {t("register.title")}
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-stack-sm">
        <div className="space-y-unit">
          <label htmlFor="reg-name" className="block text-xs font-semibold text-on-surface">{t("register.full_name_label")}</label>
          <input type="text" id="reg-name" value={fullName} onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-1.5 text-body-md text-on-surface focus:outline-none focus:border-primary-container transition-all"
            placeholder={t("register.full_name_placeholder")} />
        </div>

        <div className="space-y-unit">
          <label htmlFor="reg-user" className="block text-xs font-semibold text-on-surface">{t("register.username_label")}</label>
          <input type="text" id="reg-user" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-1.5 text-body-md text-on-surface focus:outline-none focus:border-primary-container transition-all"
            placeholder={t("register.username_placeholder")} />
        </div>

        <div className="space-y-unit">
          <label htmlFor="reg-email" className="block text-xs font-semibold text-on-surface">{t("register.email_label")}</label>
          <input type="email" id="reg-email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-1.5 text-body-md text-on-surface focus:outline-none focus:border-primary-container transition-all"
            placeholder={t("register.email_placeholder")} />
        </div>

        <div className="space-y-unit">
          <label htmlFor="reg-pass" className="block text-xs font-semibold text-on-surface">{t("login.password_label")}</label>
          <div className="relative">
            <input type={showPass ? "text" : "password"} id="reg-pass" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-1.5 pr-10 text-body-md text-on-surface focus:outline-none focus:border-primary-container transition-all"
              placeholder={t("login.password_placeholder")} />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer">
              <span className="material-symbols-outlined text-lg">{showPass ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        <div className="space-y-unit">
          <label htmlFor="reg-conf" className="block text-xs font-semibold text-on-surface">{t("password.confirm")}</label>
          <div className="relative">
            <input type={showConfirm ? "text" : "password"} id="reg-conf" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-1.5 pr-10 text-body-md text-on-surface focus:outline-none focus:border-primary-container transition-all"
              placeholder={t("login.password_placeholder")} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer">
              <span className="material-symbols-outlined text-lg">{showConfirm ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        {error && <p className="text-error-vibrant text-xs text-center pt-2">{error}</p>}

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold py-2.5 rounded-lg cursor-pointer transition-all active:scale-[0.99] mt-4 flex justify-center items-center gap-2">
          {isSubmitting ? t("register.submitting") : t("register.submit")}
        </button>
      </form>

      <div className="text-center pt-stack-md border-t border-outline-variant/10 text-sm text-on-surface-variant">
        {t("login.remember")}{" "}
        <Link href="/login" className="text-primary hover:underline font-semibold">{t("login.login_here")}</Link>
      </div>
    </div>
  );
}
