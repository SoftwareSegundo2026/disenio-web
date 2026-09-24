"use client";

import { useFavoritesStore } from "@/lib/stores/favorites-store";

/*
  Botón de favoritos (corazón).

  TODO TP: para que funcione, completá toggleFavorite en
  lib/stores/favorites-store.ts.

  - El corazón debe verse LLENO (❤️) si el producto está en
    favoritos, y VACÍO (🤍) si no.
  - Al hacer click llama a toggleFavorite(productId).
  - Podés usar useFavoritesStore((s) => s.ids.includes(productId))
    para saber si el producto está en favoritos.
*/

export function FavoriteButton({ productId }: { productId: number }) {
  const isFavorite = useFavoritesStore((s) => s.ids.includes(productId));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  return (
    <button
      onClick={() => toggleFavorite(productId)}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={isFavorite}
      className="text-2xl transition-transform hover:scale-110"
    >
      {isFavorite ? "❤️" : "🤍"}
    </button>
  );
}
