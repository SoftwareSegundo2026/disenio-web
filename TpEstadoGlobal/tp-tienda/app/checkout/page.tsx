"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  selectTotalItems,
  selectTotalPrice,
  useCartStore,
} from "@/lib/stores/cart-store";

/*
  Página de checkout (componente de CLIENTE).

  TODO TP: completá esta página para que al confirmar guarde el pedido.

  - Muestra un resumen del carrito (items y total) leyendo el store.
  - El formulario (nombre, email, dirección) ya está armado.
  - Al confirmar debés:
    1. Armar el objeto del pedido: { customer, items, total, createdAt }.
    2. Enviarlo con POST a /api/pedidos.
    3. Vaciar el carrito con clearCart().
    4. Ir a /pedidos con router.push("/pedidos").
*/

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function confirmar(e: React.FormEvent) {
    e.preventDefault();

    // TODO TP: armar el pedido y enviarlo a la API
    // const pedido = {
    //   customer: { nombre, email, direccion },
    //   items,
    //   total: totalPrice,
    //   createdAt: new Date().toISOString(),
    // };
    // const res = await fetch("/api/pedidos", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(pedido),
    // });
    // if (res.ok) {
    //   clearCart();
    //   router.push("/pedidos");
    // }

    setEnviando(true);
    console.log("TODO: confirmar pedido", { nombre, email, direccion, items });
    setEnviando(false);
  }

  if (items.length === 0) {
    return (
      <section className="py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">No hay nada para pagar</h1>
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
    <section className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="mb-6 text-2xl font-bold">Finalizar compra</h1>

        <form
          onSubmit={confirmar}
          className="flex flex-col gap-4 rounded-lg border border-border p-6 dark:border-gray-700"
        >
          <label className="flex flex-col gap-1 text-sm">
            Nombre
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="rounded-lg border border-border bg-background px-4 py-2 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-border bg-background px-4 py-2 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Dirección
            <input
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
              className="rounded-lg border border-border bg-background px-4 py-2 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800"
            />
          </label>
          <button
            type="submit"
            disabled={enviando}
            className="mt-2 rounded-full bg-primary px-6 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Confirmar pedido"}
          </button>
        </form>
      </div>

      <aside className="h-fit rounded-lg border border-border p-6 dark:border-gray-700">
        <h2 className="mb-4 text-lg font-bold">Resumen del pedido</h2>
        <ul className="mb-4 space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.product.id} className="flex justify-between">
              <span>
                {item.quantity} × {item.product.title}
              </span>
              <span className="font-semibold">
                {item.product.price.toFixed(2)} USD
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-border pt-4 dark:border-gray-700">
          <span className="font-semibold">Total ({totalItems} items)</span>
          <span className="font-bold text-primary">
            {totalPrice.toFixed(2)} USD
          </span>
        </div>
      </aside>
    </section>
  );
}
