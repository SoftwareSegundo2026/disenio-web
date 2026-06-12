import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Sonance Director Pro",
  description: "Administrative Portal for Catalog Management",
};

/*
  Layout raíz de la aplicación.
  Configura las fuentes (Sora para títulos, Inter para cuerpo,
  JetBrains Mono para código) y las variables CSS. Renderiza
  el html y body base con las clases de fuentes y el children.
  También carga los estilos globales (globals.css).
*/
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} h-full dark`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-background text-on-surface font-body-md text-body-md antialiased">
        {children}
      </body>
    </html>
  );
}
