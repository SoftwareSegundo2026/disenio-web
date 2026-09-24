"use client";

import Image from "next/image";
import Link from "next/link";
import {
  selectTotalItems,
  selectTotalPrice,
  useCartStore,
} from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/api";
import { QuantitySelector } from "@/components/QuantitySelector";

/*
  Página del carrito (componente de CLIENTE).
  Lee los items y el total directamente del store global con Zustand.
  Al tocar los botones, el estado se actualiza y esta página
  se re-renderiza automáticamente.
*/

export default function CarritoPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);

  if (items.length === 0) {
    return (
      <section className="py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mb-6 text-muted">
          Agregá productos para empezar a comprar.
        </p>
        <Link
          href="/"
          className="rounded-full bg-primary px-6 py-2 font-semibold text-white hover:bg-primary-hover"
        >
          Ver productos
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">
        Carrito ({totalItems} {totalItems === 1 ? "item" : "items"})
      </h1>

      <div className="flex flex-col gap-4 lg:flex-row">
        <ul className="flex-1 space-y-4">
          {items.map((item) => (
            <li
              key={item.product.id}
              className="flex items-center gap-4 rounded-lg border border-border p-4 dark:border-gray-700"
            >
              <Image
                src={item.product.thumbnail}
                alt={item.product.title}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <Link
                  href={`/producto/${item.product.id}`}
                  className="font-semibold hover:text-primary"
                >
                  {item.product.title}
                </Link>
                <p className="text-sm text-muted">
                  {formatPrice(item.product.price)} c/u
                </p>
              </div>
              <QuantitySelector
                productId={item.product.id}
                quantity={item.quantity}
              />
              <p className="w-20 text-right font-semibold">
                {formatPrice(item.product.price * item.quantity)}
              </p>
              <button
                onClick={() => removeItem(item.product.id)}
                aria-label={`Quitar ${item.product.title}`}
                className="text-muted hover:text-red-500"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-lg border border-border p-6 lg:w-72 dark:border-gray-700">
          <h2 className="mb-4 text-lg font-bold">Resumen</h2>
          <div className="mb-2 flex justify-between text-sm text-muted">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="mb-6 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/checkout"
              className="rounded-full bg-primary px-4 py-2 text-center font-semibold text-white hover:bg-primary-hover"
            >
              Finalizar compra
            </Link>
            <button
              onClick={clearCart}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:text-red-500 dark:border-gray-700"
            >
              Vaciar carrito
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
