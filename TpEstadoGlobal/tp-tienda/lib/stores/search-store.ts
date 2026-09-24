"use client";

import { create } from "zustand";

/*
  Store de búsqueda: guarda el término que el usuario escribe en el
  buscador de la barra de navegación.

  TODO TP: completá este store siguiendo el patrón de cart-store.ts.

  - Estado: termino: string
  - setTermino(texto): actualiza el valor de termino.
  - NO hace falta persistencia: la búsqueda es por sesión.

  Pistas:
  - Este store no usa persist, por eso la creación es más simple:
      export const useSearchStore = create<SearchState>((set) => ({ ... }));
  - setTermino así: set({ termino: texto });
*/

interface SearchState {
  termino: string;
  setTermino: (texto: string) => void;
}

// TODO TP: completar la implementación del store
export const useSearchStore = create<SearchState>((set) => ({
  termino: "",
  setTermino: (texto) => {
    // TODO TP: implementar setTermino
    console.log("TODO: setTermino", texto);
  },
}));
