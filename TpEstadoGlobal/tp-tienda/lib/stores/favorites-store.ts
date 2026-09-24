"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/*
  Store de favoritos: guarda los ids de los productos que el
  usuario marcó como favoritos.

  TODO TP: completá este store siguiendo el patrón de cart-store.ts.

  - Estado: ids: number[]
  - toggleFavorite(productId): si el id ya está en `ids`, lo quita;
    si no está, lo agrega.
  - clearFavorites(): vacía el arreglo de ids.
  - persistir con el nombre "tienda-favoritos".

  Pistas:
  - Ya importamos create, persist y createJSONStorage.
  - get() te deja leer el estado actual (get().ids).
  - toggleFavorite podés escribirlo así:
      const yaEsta = get().ids.includes(productId);
      set({ ids: yaEsta ? get().ids.filter((id) => id !== productId) : [...get().ids, productId] });
  - clearFavorites así: set({ ids: [] });
*/

interface FavoritesState {
  ids: number[];
  toggleFavorite: (productId: number) => void;
  clearFavorites: () => void;
}

// TODO TP: completar la implementación del store
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggleFavorite: (productId) => {
        // TODO TP: implementar toggleFavorite
        console.log("TODO: toggleFavorite", productId);
      },
      clearFavorites: () => {
        // TODO TP: implementar clearFavorites
        console.log("TODO: clearFavorites");
      },
    }),
    {
      name: "tienda-favoritos",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
