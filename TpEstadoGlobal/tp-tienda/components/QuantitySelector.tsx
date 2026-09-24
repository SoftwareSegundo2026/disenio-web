"use client";

import { useCartStore } from "@/lib/stores/cart-store";

/*
  Selector de cantidad: botones - / + para cambiar la cantidad
  de un producto dentro del carrito.
  Usa updateQuantity del store de carrito.
*/

export function QuantitySelector({
  productId,
  quantity,
}: {
  productId: number;
  quantity: number;
}) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => updateQuantity(productId, quantity - 1)}
        aria-label="Disminuir cantidad"
        className="h-8 w-8 rounded-full border border-border text-muted hover:text-primary dark:border-gray-700"
      >
        −
      </button>
      <span className="w-8 text-center font-semibold">{quantity}</span>
      <button
        onClick={() => updateQuantity(productId, quantity + 1)}
        aria-label="Aumentar cantidad"
        className="h-8 w-8 rounded-full border border-border text-muted hover:text-primary dark:border-gray-700"
      >
        +
      </button>
    </div>
  );
}
