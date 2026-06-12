"use client";

import { useState } from "react";
import { resetUserPassword } from "@/lib/db";
import { t } from "@/lib/i18n";

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}

/*
  Modal para resetear la contraseña de un usuario (solo admin).
  Recibe userId y userName para mostrar contexto. Al confirmar,
  llama a resetUserPassword(). Muestra error si falla.
*/
export default function ResetPasswordModal({ open, onClose, userId, userName }: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError(t("password.all_required_simple"));
      return;
    }

    if (newPassword.length < 6) {
      setError(t("password.min_length"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("password.mismatch"));
      return;
    }

    setIsSubmitting(true);
    try {
      await resetUserPassword(userId, newPassword);
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("password.error"));
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
        <button onClick={onClose} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-warning-vibrant/20 flex items-center justify-center mx-auto mb-2 border border-warning-vibrant/30">
            <span className="material-symbols-outlined text-warning-vibrant">key</span>
          </div>
          <h2 className="font-display-lg text-headline-md font-bold text-on-surface">{t("password.reset_title")}</h2>
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-75 mt-1">{t("password.reset_subtitle", { name: userName })}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <div className="space-y-unit">
            <label htmlFor="reset-new-password" className="block text-sm font-semibold text-on-surface">{t("password.new")}</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                id="reset-new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 pr-10 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                placeholder={t("password.new_placeholder")}
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer">
                <span className="material-symbols-outlined text-lg">{showNew ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          <div className="space-y-unit">
            <label htmlFor="reset-confirm-password" className="block text-sm font-semibold text-on-surface">{t("password.confirm")}</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                id="reset-confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 pr-10 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                placeholder={t("password.confirm_placeholder")}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer">
                <span className="material-symbols-outlined text-lg">{showConfirm ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          {error && <p className="text-error-vibrant text-xs text-center">{error}</p>}

          <div className="flex gap-3 pt-stack-md">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95">
              {t("confirm.cancel")}
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-2 bg-warning-vibrant hover:bg-warning-vibrant/90 disabled:opacity-50 text-white font-bold rounded-lg cursor-pointer transition-all active:scale-[0.99]">
              {isSubmitting ? t("password.saving") : t("password.reset_btn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
