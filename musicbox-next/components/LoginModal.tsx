"use client";

import { useState } from "react";
import { config } from "@/lib/config";
import { loginApi } from "@/lib/db";
import Link from "next/link";
import { t } from "@/lib/i18n";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function LoginModal({ open, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError(t("login.validation"));
      return;
    }

    setIsSubmitting(true);

    try {
      await loginApi({ username: username.trim(), password });
      setUsername("");
      setPassword("");
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative bg-surface-medium surface-rim p-gutter rounded-xl w-full max-w-sm mx-4 space-y-stack-lg shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="text-center">
          <h2 className="font-display-lg text-headline-md font-bold text-primary">{config.appName}</h2>
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-75 mt-1">
            {t("login.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <div className="space-y-unit">
            <label htmlFor="modal-username" className="block text-sm font-semibold text-on-surface">
              {t("login.username_label")}
            </label>
            <input
              type="text"
              id="modal-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder={t("login.username_placeholder")}
            />
          </div>

          <div className="space-y-unit">
            <label htmlFor="modal-pass" className="block text-sm font-semibold text-on-surface">
              {t("login.password_label")}
            </label>
            <input
              type="password"
              id="modal-pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder={t("login.password_placeholder")}
            />
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
          <Link href="/register" onClick={onClose} className="text-primary hover:underline font-semibold">
            {t("login.create_account")}
          </Link>
        </div>
      </div>
    </div>
  );
}
