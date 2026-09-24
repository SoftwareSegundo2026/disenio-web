"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";

/*
  Store global del carrito con Zustand + persistencia.

  Cómo funciona:
  - create<CartState>()(persist(...)) crea el store.
  - persist guarda automáticamente el estado en localStorage
    bajo el nombre "tienda-carrito" y lo restaura al recargar.
  - createJSONStorage(() => localStorage) indica dónde guardar.
  - Los componentes leen el estado con useCartStore((s) => s.xxx)
    y llaman a las acciones (addItem, removeItem, etc.).

  Este es el EJEMPLO COMPLETO. Usalo de referencia para completar
  favorites-store.ts y search-store.ts con el mismo patrón.
*/

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Agrega un producto o suma cantidad si ya existe.
      addItem: (product, quantity = 1) => {
        const existente = get().items.find((i) => i.product.id === product.id);
        if (existente) {
          set({
            items: get().items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity }] });
        }
      },

      // Quita un producto del carrito.
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
      },

      // Actualiza la cantidad de un producto (mínimo 1).
      updateQuantity: (productId, quantity) => {
        set({
          items: get().items.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: Math.max(1, quantity) }
              : i,
          ),
        });
      },

      // Vacía el carrito completo.
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "tienda-carrito",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Selectores: funciones que extraen valores derivados del estado.
export const selectTotalItems = (state: CartState) =>
  state.items.reduce((total, i) => total + i.quantity, 0);

export const selectTotalPrice = (state: CartState) =>
  state.items.reduce((total, i) => total + i.product.price * i.quantity, 0);
