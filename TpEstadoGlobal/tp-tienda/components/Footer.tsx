import Link from "next/link";
import { config } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-border py-6 dark:border-gray-700">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {config.appName}
        </p>
        <nav className="flex gap-4">
          <Link href="/" className="hover:text-primary">
            Inicio
          </Link>
          <Link href="/carrito" className="hover:text-primary">
            Carrito
          </Link>
          <Link href="/about" className="hover:text-primary">
            Acerca de
          </Link>
        </nav>
      </div>
    </footer>
  );
}
