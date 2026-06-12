"use client";

import { useState } from "react";
import { changeMyPassword } from "@/lib/db";
import { t } from "@/lib/i18n";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

function PasswordInput({
  id,
  value,
  onChange,
  label,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-unit">
      <label htmlFor={id} className="block text-sm font-semibold text-on-surface">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 pr-10 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">{show ? "visibility_off" : "visibility"}</span>
        </button>
      </div>
    </div>
  );
}

/*
  Modal para cambiar la contraseña del usuario actual.
  Pide contraseña actual y nueva (con confirmación).
  Valida que coincidan y que no estén vacías antes de
  llamar a changeMyPassword(). Muestra error si falla.
*/
export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t("password.all_required"));
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
      await changeMyPassword(currentPassword, newPassword);
      setCurrentPassword("");
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
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 border border-primary/30">
            <span className="material-symbols-outlined text-primary">lock</span>
          </div>
          <h2 className="font-display-lg text-headline-md font-bold text-on-surface">{t("password.change_title")}</h2>
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-75 mt-1">{t("password.change_subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <PasswordInput
            id="current-password"
            value={currentPassword}
            onChange={setCurrentPassword}
            label={t("password.current")}
            placeholder={t("password.current_placeholder")}
          />
          <PasswordInput
            id="new-password"
            value={newPassword}
            onChange={setNewPassword}
            label={t("password.new")}
            placeholder={t("password.new_placeholder")}
          />
          <PasswordInput
            id="confirm-password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            label={t("password.confirm")}
            placeholder={t("password.confirm_placeholder")}
          />

          {error && <p className="text-error-vibrant text-xs text-center">{error}</p>}

          <div className="flex gap-3 pt-stack-md">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95">
              {t("confirm.cancel")}
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-[0.99]">
              {isSubmitting ? t("password.saving") : t("password.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
