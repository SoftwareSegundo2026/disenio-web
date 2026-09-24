"use client";

import { useCartStore } from "@/lib/stores/cart-store";
import type { Product } from "@/lib/types";

/*
  Botón "Agregar al carrito".
  Llama a addItem del store de carrito (Zustand).
  Al agregar, el badge del Navbar se actualiza automáticamente
  porque ambos componentes leen el mismo store global.
*/

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      onClick={() => addItem(product)}
      className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
    >
      Agregar al carrito
    </button>
  );
}
