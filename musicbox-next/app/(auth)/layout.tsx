import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-gutter">
      <div className="w-full max-w-[480px]">
        {children}
      </div>
    </div>
  );
}
