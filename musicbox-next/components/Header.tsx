"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getIsAdmin, logout as logoutDb } from "@/lib/db";
import LoginModal from "./LoginModal";
import { t } from "@/lib/i18n";
import UserMenu from "./UserMenu";
import ChangePasswordModal from "./ChangePasswordModal";
import ProfileEditModal from "./ProfileEditModal";

interface HeaderProps {
  onSearch?: (value: string) => void;
}

/*
  Barra superior de la aplicación.
  Muestra el nombre de la app, estado de autenticación,
  y botones de login/logout. Cuando el usuario está logueado,
  muestra un menú (UserMenu) con opciones de perfil y cambio
  de contraseña. También incluye modales de login, perfil y
  cambio de contraseña.
*/
export default function Header({ onSearch }: HeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
    setIsAdmin(getIsAdmin());
  }, []);

  useEffect(() => {
    const handleExpired = () => {
      setIsLoggedIn(false);
      setIsAdmin(false);
      router.push("/");
    };
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  const handleLogout = () => {
    logoutDb();
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.dispatchEvent(new CustomEvent("auth:expired"));
    router.push("/");
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAdmin(getIsAdmin());
    setLoginModalOpen(false);
    window.dispatchEvent(new CustomEvent("auth:login"));
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center px-gutter py-stack-md border-b border-outline-variant/10">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="w-full relative group">
            <span className="material-symbols-outlined absolute left-stack-md top-1/2 -translate-y-1/2 text-on-surface-variant text-body-lg">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={handleChange}
              className="w-full bg-surface-high border-none rounded-lg pl-12 pr-stack-md py-2 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:ring-1 focus:ring-primary-container focus:outline-none transition-all"
              placeholder={t("search.placeholder")}
            />
          </div>
        </div>

        <div className="flex items-center gap-stack-lg ml-stack-lg">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-on-surface-variant hover:text-error-vibrant transition-colors cursor-pointer text-sm font-semibold"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                {t("header.logout")}
              </button>
              <UserMenu isAdmin={isAdmin} onProfile={() => setShowProfile(true)} onChangePassword={() => setShowChangePassword(true)} />
            </>
          ) : (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-sm font-semibold"
            >
                <span className="material-symbols-outlined text-lg">login</span>
                {t("header.login")}
            </button>
          )}
        </div>
      </header>

      <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} onLogin={handleLoginSuccess} />
      <ChangePasswordModal open={showChangePassword} onClose={() => setShowChangePassword(false)} />
      <ProfileEditModal open={showProfile} onClose={() => setShowProfile(false)} onSaved={() => setShowProfile(false)} />
    </>
  );
}
