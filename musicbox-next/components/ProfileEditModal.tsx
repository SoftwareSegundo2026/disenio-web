"use client";

import { useState, useEffect } from "react";
import { update, getStoredUserId, getStoredFullName } from "@/lib/db";

function getStoredEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("email") || "";
}

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProfileEditModal({ open, onClose, onSaved }: ProfileEditModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFullName(getStoredFullName() || "");
      setEmail(getStoredEmail());
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim()) {
      setError("Full name and email are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    const userId = getStoredUserId();
    if (!userId) {
      setError("User ID not found");
      return;
    }

    setIsSubmitting(true);

    try {
      await update("users", userId, {
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
      });
      localStorage.setItem("full_name", fullName.trim());
      localStorage.setItem("email", email.trim().toLowerCase());
      onSaved();
      onClose();
    } catch {
      setError("Failed to save changes. Please try again.");
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
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 border border-primary/30">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
          <h2 className="font-display-lg text-headline-md font-bold text-on-surface">Edit Profile</h2>
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-75 mt-1">
            Update your personal information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <div className="space-y-unit">
            <label htmlFor="profile-name" className="block text-sm font-semibold text-on-surface">
              Full Name
            </label>
            <input
              type="text"
              id="profile-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-unit">
            <label htmlFor="profile-email" className="block text-sm font-semibold text-on-surface">
              Email
            </label>
            <input
              type="email"
              id="profile-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-high border border-outline-variant/30 rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder="name@sonance.pro"
            />
          </div>

          {error && <p className="text-error-vibrant text-xs text-center">{error}</p>}

          <div className="flex gap-3 pt-stack-md">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-surface-high hover:bg-surface-high/80 text-on-surface rounded-lg cursor-pointer transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-2 bg-primary-container hover:bg-primary-container/90 disabled:opacity-50 text-on-primary font-bold rounded-lg cursor-pointer transition-all active:scale-[0.99]"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
