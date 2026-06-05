"use client";

import { type ReactNode } from "react";
import Swal from "sweetalert2";
import { getToken, getIsAdmin } from "@/lib/db";
import { t } from "@/lib/i18n";

interface RequireAuthProps {
  children: ReactNode;
  adminOnly?: boolean;
  message?: string;
}

export default function RequireAuth({ children, adminOnly = true, message }: RequireAuthProps) {
  const token = getToken();
  const hasPermission = token && (!adminOnly || getIsAdmin());

  if (hasPermission) return <>{children}</>;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: t("auth.required_title"),
        text: t("auth.required_text"),
        confirmButtonColor: "#6366f1",
      });
    } else if (adminOnly && !getIsAdmin()) {
      Swal.fire({
        icon: "warning",
        title: t("auth.admin_title"),
        text: t("auth.admin_text"),
        confirmButtonColor: "#6366f1",
      });
    }
  };

  return (
    <span onClickCapture={handleClick} role="presentation">
      {children}
    </span>
  );
}
