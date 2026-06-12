"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { config } from "@/lib/config";
import { getAllUsers, getUserCount, deleteUser, updateUser, getIsAdmin } from "@/lib/db";
import type { ApiUser } from "@/lib/db";
import Pagination from "@/components/Pagination";
import ResetPasswordModal from "@/components/ResetPasswordModal";
import Swal from "sweetalert2";
import { t } from "@/lib/i18n";

/*
  Página: Lista de usuarios (solo admin).
  Usa getAllUsers() y getUserCount() que requieren autenticación.
  Permite activar/desactivar, editar, eliminar y resetear
  contraseña de cada usuario. El admin no puede auto-eliminarse
  ni desactivarse.
*/
export default function UsersList() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [resetUserName, setResetUserName] = useState("");
  const rowsPerPage = config.rowsPerPage;
  const isAdmin = getIsAdmin();

  const loadUsers = async (p: number) => {
    try {
      const list = await getAllUsers(p * rowsPerPage, rowsPerPage);
      setUsers(list);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers(page);
  }, [page]);

  const fetchTotal = async () => {
    try {
      const total = await getUserCount();
      setTotalCount(total);
    } catch {
      setTotalCount(0);
    }
  };

  useEffect(() => {
    fetchTotal();
  }, []);

  const handleDelete = async (user: ApiUser) => {
    const result = await Swal.fire({
      title: t("confirm.delete_title", { item: "User" }),
      text: t("confirm.delete_text", { name: user.full_name || user.username }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("confirm.delete"),
      cancelButtonText: t("confirm.cancel"),
    });
    if (!result.isConfirmed) return;
    if (!user.user_id) return;
    try {
      await deleteUser(user.user_id);
      if (users.length === 1 && page > 0) setPage(page - 1);
      else await loadUsers(page);
      setTotalCount((c) => c - 1);
      Swal.fire(t("confirm.deleted_title"), t("confirm.deleted_text", { name: user.full_name || user.username }), "success");
    } catch {
      Swal.fire(t("confirm.error_title"), t("confirm.error_text", { item: "user" }), "error");
    }
  };

  const toggleUserStatus = async (user: ApiUser) => {
    if (!user.user_id) return;
    await updateUser(user.user_id, { disabled: !user.disabled });
    await loadUsers(page);
  };

  return (
    <div className="space-y-stack-md animate-fadeIn">
      <div className="flex justify-between items-center mb-stack-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">{t("page.users")}</h2>
          <p className="text-on-surface-variant">{t("page.users_sub")}</p>
        </div>
        {isAdmin && (
          <Link href="/users/new">
            <button className="bg-primary-container hover:bg-primary-container/90 text-on-primary font-bold py-2 px-stack-lg rounded-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">person_add</span>{t("page.add_user")}
            </button>
          </Link>
        )}
      </div>

      <div className="bg-surface-medium surface-rim rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-low/50">
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.user")}</th>
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.email")}</th>
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.role")}</th>
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase">{t("list.status")}</th>
              <th className="px-gutter py-stack-md font-label-caps text-label-caps text-on-surface-variant uppercase text-right">{t("list.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-gutter py-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">person</span>
                  {t("page.empty_users")}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.user_id || user.username} className="hover:bg-surface-high transition-colors group">
                  <td className="px-gutter py-stack-md">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                        <span className="material-symbols-outlined text-md text-secondary">person</span>
                      </div>
                      <div>
                        <span className="font-semibold text-on-surface block">{user.full_name || user.username}</span>
                        <span className="font-label-caps text-[10px] text-on-surface-variant opacity-60">@{user.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-gutter py-stack-md text-on-surface">{user.email || "—"}</td>
                  <td className="px-gutter py-stack-md text-on-surface-variant">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-label-caps border ${user.is_admin ? "bg-primary/10 text-primary border-primary/30" : "bg-surface-high text-on-surface-variant border-outline-variant/20"}`}>
                      {t(user.is_admin ? "user.role_admin" : "user.role_editor")}
                    </span>
                  </td>
                  <td className="px-gutter py-stack-md">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${!user.disabled ? "bg-success-vibrant animate-pulse" : "bg-error-vibrant"}`}></span>
                      <span className="text-body-md text-on-surface">{t(!user.disabled ? "user.status_active" : "user.status_inactive")}</span>
                    </div>
                  </td>
                  <td className="px-gutter py-stack-md text-right">
                    <div className="flex justify-end gap-2">
                      {isAdmin && (
                        <button onClick={() => toggleUserStatus(user)} disabled={user.username === "admin"}
                          className={`p-1 transition-colors cursor-pointer ${user.disabled ? "text-success-vibrant hover:text-success-vibrant/80" : "text-warning-vibrant hover:text-warning-vibrant/80"} disabled:opacity-30`}
                          title={t(user.disabled ? "list.activate" : "list.deactivate")}>
                          <span className="material-symbols-outlined text-xl">{user.disabled ? "check_circle" : "pause_circle"}</span>
                        </button>
                      )}
                      {isAdmin && (
                        <Link href={`/users/${user.user_id || ""}/edit`}>
                          <button className="p-1 hover:text-secondary transition-colors cursor-pointer" title={t("list.edit")}><span className="material-symbols-outlined text-xl">edit</span></button>
                        </Link>
                      )}
                      {isAdmin && (
                        <button onClick={() => handleDelete(user)} disabled={user.username === "admin"}
                          className="p-1 hover:text-error-vibrant disabled:opacity-30 disabled:hover:text-on-surface-variant transition-colors cursor-pointer" title={t("list.delete")}>
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      )}
                      {isAdmin && (
                        <button onClick={() => { setResetUserId(user.user_id ?? null); setResetUserName(user.full_name || user.username); }}
                          className="p-1 hover:text-warning-vibrant transition-colors cursor-pointer" title={t("password.reset_btn")}>
                          <span className="material-symbols-outlined text-xl">key</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination page={page} totalCount={totalCount} rowsPerPage={rowsPerPage} onPageChange={setPage} />
      </div>

      {resetUserId !== null && (
        <ResetPasswordModal
          open={resetUserId !== null}
          onClose={() => setResetUserId(null)}
          userId={resetUserId}
          userName={resetUserName}
        />
      )}
    </div>
  );
}
