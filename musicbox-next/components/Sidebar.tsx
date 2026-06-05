"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { config } from "@/lib/config";
import { getToken, getIsAdmin } from "@/lib/db";
import { t } from "@/lib/i18n";

export default function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [tick, setTick] = useState(0);

  const recheckAdmin = () => {
    if (getToken()) {
      setIsAdmin(getIsAdmin());
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => { recheckAdmin(); }, [pathname]);

  useEffect(() => {
    const handler = () => { recheckAdmin(); setTick((t) => t + 1); };
    window.addEventListener("auth:login", handler);
    window.addEventListener("auth:expired", handler);
    return () => {
      window.removeEventListener("auth:login", handler);
      window.removeEventListener("auth:expired", handler);
    };
  }, []);

  const navItems = [
    { name: t("nav.dashboard"), href: "/", icon: "dashboard" },
    { name: t("nav.artists"), href: "/artists", icon: "group" },
    { name: t("nav.albums"), href: "/albums", icon: "album" },
    { name: t("nav.genres"), href: "/genres", icon: "library_music" },
    { name: t("nav.tracks"), href: "/tracks", icon: "audiotrack" },
    ...(isAdmin ? [{ name: t("nav.users"), href: "/users", icon: "person" as const }] : []),
  ];

  const isLinkActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className={`w-[260px] h-screen fixed left-0 top-0 bg-surface-low flex flex-col py-stack-lg z-50 overflow-y-auto border-r border-outline-variant/10`}>
      <div className="px-gutter mb-stack-lg">
        <h1 className="font-display-lg text-headline-md font-bold text-primary">{config.appName}</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant opacity-70">{t("app.subtitle")}</p>
      </div>

      <nav className="flex-1 space-y-unit">
        {navItems.map((item) => {
          const active = isLinkActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center px-gutter py-stack-sm transition-all duration-200 ease-in-out group ${
                active
                  ? "text-primary border-l-[3px] border-primary-container bg-primary-container/10"
                  : "text-on-surface-variant hover:bg-surface-medium hover:text-primary"
              }`}
            >
              {active && <span className="sidebar-glow-bar"></span>}
              <span className="material-symbols-outlined mr-stack-md" data-icon={item.icon}>
                {item.icon}
              </span>
              <span className="font-label-caps text-label-caps">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
