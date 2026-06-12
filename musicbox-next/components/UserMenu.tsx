"use client";

import { useState, useRef, useEffect } from "react";
import { t } from "@/lib/i18n";

interface UserMenuProps {
  isAdmin: boolean;
  onProfile: () => void;
  onChangePassword: () => void;
}

/*
  Menú desplegable del usuario (avatar + nombre).
  Muestra opciones de perfil y cambio de contraseña.
  Se cierra al hacer clic fuera (useRef + click handler).
  isAdmin controla si se muestran opciones de admin.
*/
export default function UserMenu({ isAdmin, onProfile, onChangePassword }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 hover:bg-primary/20 cursor-pointer transition-all"
        title={isAdmin ? t("header.admin") : t("header.edit_profile")}
      >
        <span className="material-symbols-outlined text-primary text-sm">person</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-surface-medium surface-rim rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn">
          <button
            onClick={() => { setOpen(false); onProfile(); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg text-on-surface-variant">person</span>
            {t("menu.profile")}
          </button>
          <button
            onClick={() => { setOpen(false); onChangePassword(); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-high transition-colors cursor-pointer border-t border-outline-variant/10"
          >
            <span className="material-symbols-outlined text-lg text-on-surface-variant">lock</span>
            {t("menu.change_password")}
          </button>
        </div>
      )}
    </div>
  );
}
