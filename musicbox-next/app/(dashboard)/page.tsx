"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getAll, getAllProtected, getToken, getIsAdmin, getActivities, getStoredFullName } from "@/lib/db";
import { t, formatDate } from "@/lib/i18n";
import type { ApiArtist, ApiAlbum, ApiTrack, ApiUser, ApiActivity } from "@/lib/db";

interface Stats {
  artists: number;
  albums: number;
  tracks: number;
  users: number;
}

interface ActivityDisplay {
  id: number;
  name: string;
  type: string;
  action: string;
  date: string;
  icon: string;
  colorClass: string;
  bgClass: string;
}

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
    setIsAdmin(getIsAdmin());
  }, []);

  const [stats, setStats] = useState<Stats>({
    artists: 0,
    albums: 0,
    tracks: 0,
    users: 0,
  });

  const [activityList, setActivityList] = useState<ActivityDisplay[]>([]);
  const [storageBytes, setStorageBytes] = useState(0);

  const loadData = useCallback(async (isAdminUser: boolean) => {
    const [artists, albums, tracks] = await Promise.all([
      getAll<ApiArtist>("artists"),
      getAll<ApiAlbum>("albums"),
      getAll<ApiTrack>("tracks"),
    ]);

    let usersCount = 0;
    if (isAdminUser) {
      try {
        const users = await getAllProtected<ApiUser>("users");
        usersCount = users.filter((u) => !u.disabled).length;
      } catch {
        usersCount = 0;
      }
    }

    const totalBytes = (tracks as ApiTrack[]).reduce(
      (sum, t) => sum + (t.Bytes || 0),
      0
    );
    setStorageBytes(totalBytes);

    setStats({
      artists: artists.length,
      albums: albums.length,
      tracks: tracks.length,
      users: usersCount,
    });
  }, []);

  const loadActivities = useCallback(async () => {
    try {
      const activities = await getActivities(0, 10);
      const actionConfig: Record<string, { action: string; icon: string; colorClass: string; bgClass: string }> = {
        login: { action: t("activity.login"), icon: "login", colorClass: "text-on-surface-variant", bgClass: "bg-surface-high" },
        create: { action: t("activity.create"), icon: "add_circle", colorClass: "text-success-vibrant", bgClass: "bg-success-vibrant/10" },
        update: { action: t("activity.update"), icon: "edit", colorClass: "text-secondary", bgClass: "bg-secondary/10" },
        delete: { action: t("activity.delete"), icon: "delete", colorClass: "text-error-vibrant", bgClass: "bg-error-vibrant/10" },
      };

      const typeFromDetail = (detail: string | null): string => {
        if (!detail) return t("activity.system");
        if (detail.toLowerCase().includes("genre")) return t("activity.genre");
        if (detail.toLowerCase().includes("artist")) return t("activity.artist");
        if (detail.toLowerCase().includes("album")) return t("activity.album");
        if (detail.toLowerCase().includes("track")) return t("activity.track");
        if (detail.toLowerCase().includes("user")) return t("activity.user");
        if (detail.toLowerCase().includes("login") || detail.toLowerCase().includes("log in")) return t("activity.session");
        return t("activity.system");
      };

      setActivityList(
        activities.map((a) => {
          const cfg = actionConfig[a.action_type] || { action: a.action_type, icon: "circle", colorClass: "text-on-surface-variant", bgClass: "bg-surface-high" };
          return {
            id: a.activity_id,
            name: a.detail || a.username,
            type: typeFromDetail(a.detail),
            action: cfg.action,
            date: formatDate(a.timestamp),
            icon: cfg.icon,
            colorClass: cfg.colorClass,
            bgClass: cfg.bgClass,
          };
        })
      );
    } catch {
      setActivityList([]);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoggedIn(!!getToken());
    const admin = getIsAdmin();
    setIsAdmin(admin);
    await Promise.all([loadData(admin), loadActivities()]);
  }, [loadData, loadActivities]);

  useEffect(() => { refreshAll(); }, [refreshAll]);

  useEffect(() => {
    window.addEventListener("auth:login", refreshAll);
    window.addEventListener("auth:expired", refreshAll);
    return () => {
      window.removeEventListener("auth:login", refreshAll);
      window.removeEventListener("auth:expired", refreshAll);
    };
  }, [refreshAll]);

  return (
    <div className="space-y-stack-lg animate-fadeIn">
      <section className="mb-stack-lg">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm">
          {isLoggedIn ? t("welcome.user", { name: getStoredFullName() || "User" }) : t("welcome.guest")}
        </h2>
        <p className="text-on-surface-variant max-w-2xl">
          {t("welcome.summary")}
        </p>
      </section>

      <section className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-gutter`}>
        <div className="bg-surface-medium surface-rim p-gutter rounded-xl relative overflow-hidden group hover:bg-surface-high transition-all duration-300">
          <div className="relative z-10">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm">
              {t("dashboard.total_artists")}
            </p>
            <h3 className="font-headline-lg text-headline-lg text-primary-fixed-dim">
              {stats.artists}
            </h3>
            <div className="mt-stack-md flex items-center gap-unit text-[11px] text-success-vibrant">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>{t("dashboard.total_artists_sub")}</span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 translate-y-1/4 translate-x-1/4 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-[120px]">group</span>
          </div>
        </div>

        <div className="bg-surface-medium surface-rim p-gutter rounded-xl relative overflow-hidden group hover:bg-surface-high transition-all duration-300">
          <div className="relative z-10">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm">
              {t("dashboard.total_albums")}
            </p>
            <h3 className="font-headline-lg text-headline-lg text-primary-fixed-dim">
              {stats.albums}
            </h3>
            <div className="mt-stack-md flex items-center gap-unit text-[11px] text-success-vibrant">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>{t("dashboard.total_albums_sub")}</span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 translate-y-1/4 translate-x-1/4 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-[120px]">album</span>
          </div>
        </div>

        <div className="bg-surface-medium surface-rim p-gutter rounded-xl relative overflow-hidden group hover:bg-surface-high transition-all duration-300">
          <div className="relative z-10">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm">
              {t("dashboard.total_tracks")}
            </p>
            <h3 className="font-headline-lg text-headline-lg text-primary-fixed-dim">
              {stats.tracks}
            </h3>
            <div className="mt-stack-md flex items-center gap-unit text-[11px] text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">reorder</span>
              <span>{t("dashboard.total_tracks_sub")}</span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 translate-y-1/4 translate-x-1/4 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-[120px]">audiotrack</span>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-surface-medium surface-rim p-gutter rounded-xl relative overflow-hidden group hover:bg-surface-high transition-all duration-300 border-l-2 border-primary">
            <div className="relative z-10">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm">
                {t("dashboard.active_users")}
              </p>
              <h3 className="font-headline-lg text-headline-lg text-primary">{stats.users}</h3>
              <div className="mt-stack-md flex items-center gap-unit">
                <span className="w-2 h-2 rounded-full bg-success-vibrant animate-pulse"></span>
                <span className="text-[11px] text-success-vibrant">{t("dashboard.active_users_sub")}</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 translate-y-1/4 translate-x-1/4 group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-[120px]">person</span>
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <section className="lg:col-span-2 bg-surface-medium surface-rim rounded-xl overflow-hidden flex flex-col">
          <div className="p-gutter border-b border-outline-variant/20 flex justify-between items-center">
            <h4 className="font-headline-md text-headline-md text-on-surface">
              {t("dashboard.recent_activity")}
            </h4>
            <span className="font-label-caps text-label-caps text-on-surface-variant opacity-60">
              {t("dashboard.live_feed")}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-low/50">
                  <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">
                    {t("dashboard.activity_item")}
                  </th>
                  <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">
                    {t("dashboard.activity_type")}
                  </th>
                  <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">
                    {t("dashboard.activity_action")}
                  </th>
                  <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase text-right">
                    {t("dashboard.activity_date")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {activityList.map((activity) => (
                  <tr key={activity.id} className="hover:bg-surface-high transition-colors group">
                    <td className="px-gutter py-stack-md">
                      <div className="flex items-center gap-stack-sm">
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${activity.bgClass}`}>
                          <span className={`material-symbols-outlined scale-75 ${activity.colorClass}`}>
                            {activity.icon}
                          </span>
                        </div>
                        <span className="font-table-data text-table-data text-on-surface">
                          {activity.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-gutter py-stack-md">
                      <span className="px-2 py-0.5 rounded bg-surface-high text-on-surface-variant text-[11px] font-label-caps border border-outline-variant/20">
                        {activity.type}
                      </span>
                    </td>
                    <td className="px-gutter py-stack-md">
                      <span
                        className={`text-body-md ${
                          activity.action === "Created"
                            ? "text-success-vibrant"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {activity.action}
                      </span>
                    </td>
                    <td className="px-gutter py-stack-md text-right font-label-caps text-label-caps opacity-60">
                      {activity.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-gutter">
          <div className="bg-surface-medium surface-rim rounded-xl p-gutter h-full">
            {isAdmin && (
              <>
                <h4 className="font-headline-md text-headline-md text-on-surface mb-stack-lg">
                  {t("dashboard.quick_actions")}
                </h4>
                <div className="space-y-stack-md">
                  <Link href="/artists/new">
                    <button className="w-full bg-primary-container hover:bg-primary-container/90 text-on-primary font-bold py-stack-md px-stack-lg rounded-lg flex items-center justify-between group transition-all active:scale-[0.98] cursor-pointer mb-2">
                      <span className="flex items-center gap-stack-md">
                        <span className="material-symbols-outlined">person_add</span>
                        {t("dashboard.add_artist")}
                      </span>
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </button>
                  </Link>
                  <Link href="/tracks/new">
                    <button className="w-full border border-primary-container text-primary-container py-stack-md px-stack-lg rounded-lg flex items-center justify-between group transition-all hover:bg-primary-container/10 active:scale-[0.98] cursor-pointer mb-2">
                      <span className="flex items-center gap-stack-md">
                        <span className="material-symbols-outlined">upload_file</span>
                        {t("dashboard.upload_tracks")}
                      </span>
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </button>
                  </Link>
                  <Link href="/albums/new">
                    <button className="w-full bg-surface-high text-on-surface-variant py-stack-md px-stack-lg rounded-lg flex items-center justify-between group transition-all hover:text-primary hover:bg-surface-high/80 active:scale-[0.98] cursor-pointer">
                      <span className="flex items-center gap-stack-md">
                        <span className="material-symbols-outlined">library_add</span>
                        {t("dashboard.create_album")}
                      </span>
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </button>
                  </Link>
                </div>
              </>
            )}
            <div className={isAdmin ? "mt-stack-lg pt-stack-lg border-t border-outline-variant/20" : ""}>
              <div className="flex items-center justify-between mb-stack-md">
                <h5 className="font-label-caps text-label-caps text-on-surface">{t("dashboard.storage_used")}</h5>
                <span className="text-table-data text-on-surface-variant">{storageBytes > 0 ? `${(storageBytes / (1024 ** 3)).toFixed(1)} GB` : "—"}</span>
              </div>
              <div className="h-2 w-full bg-surface-low rounded-full overflow-hidden mb-stack-sm">
                <div className="h-full bg-primary-container" style={{ width: `${Math.min((storageBytes / (500 * 1024 ** 3)) * 100, 100)}%` }}></div>
              </div>
              <p className="text-[11px] text-on-surface-variant">{t("dashboard.storage_text", { size: (storageBytes / (1024 ** 3)).toFixed(1) })}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-container/20 to-surface-medium surface-rim rounded-xl p-gutter border-l-4 border-primary">
            <div className="flex items-start gap-stack-md">
              <span
                className="material-symbols-outlined text-primary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              <div>
                <h5 className="font-label-caps text-label-caps text-primary-container mb-unit">
                  {t("dashboard.pro_insight")}
                </h5>
                <p className="text-body-md text-on-surface">
                  {t("dashboard.pro_insight_text")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
