import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/context/theme-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { config } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: config.appName,
  description: "Tienda online con carrito, favoritos y estado global",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-6xl px-4 py-8">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
