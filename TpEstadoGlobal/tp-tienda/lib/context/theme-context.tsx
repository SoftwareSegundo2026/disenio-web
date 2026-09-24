"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

/*
  Tema claro/oscuro con Context API.

  Context vs Zustand:
  - Context API es el mecanismo nativo de React para compartir estado
    entre componentes sin pasarlo por props (evita "prop drilling").
  - Zustand también comparte estado, pero agrega persistencia,
    selectores y evita re-renders innecesarios.

  En este proyecto usamos los DOS:
  - Context API para el tema (es el EJEMPLO COMPLETO de Context).
  - Zustand para carrito, favoritos y búsqueda (los stores).

  El tema se guarda en localStorage con el key "tienda-tema".
*/

interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Al montar el componente, leemos el tema guardado (si existe).
  useEffect(() => {
    const guardado = localStorage.getItem("tienda-tema") as
      "light" | "dark" | null;
    if (guardado) setTheme(guardado);
  }, []);

  // Cada vez que cambia el tema, lo aplicamos al <html> y lo guardamos.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("tienda-tema", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook para consumir el contexto desde cualquier componente.
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
}
