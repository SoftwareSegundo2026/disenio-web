"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";

/*
  Página de pedidos (componente de CLIENTE).

  TODO TP: completá esta página guiándote por app/comentarios/page.tsx.
  Debe mostrar los pedidos guardados con sus items, total y fecha.

  Pistas:
  - GET /api/pedidos devuelve un arreglo de pedidos (tipo Order).
  - Cada pedido tiene: customer { nombre, email, direccion },
    items (cada uno con product { title, price } y quantity),
    total y createdAt.
  - Formateá la fecha: new Date(pedido.createdAt).toLocaleDateString("es-AR").
  - Total por item: item.product.price * item.quantity.
  - Podés usar formatPrice de lib/api.ts para mostrar los montos.

  Estado actual: solo muestra el número de pedido.
  Completá los TODO para mostrar el resto.
*/

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/pedidos")
      .then((res) => res.json())
      .then(setPedidos)
      .finally(() => setCargando(false));
  }, []);

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Mis pedidos</h1>

      {cargando ? (
        <p className="py-8 text-center text-muted">Cargando...</p>
      ) : pedidos.length === 0 ? (
        <p className="py-8 text-center text-muted">Aún no tenés pedidos.</p>
      ) : (
        <ul className="space-y-4">
          {pedidos.map((pedido) => (
            <li
              key={pedido.id}
              className="rounded-lg border border-border p-4 dark:border-gray-700"
            >
              <h2 className="mb-2 font-semibold">Pedido #{pedido.id}</h2>

              {/* TODO TP: mostrar nombre, email y dirección del cliente */}
              <p className="mb-3 text-sm text-muted">
                {/* acá va la info del cliente */}
              </p>

              {/* TODO TP: mostrar los items con cantidad y subtotal */}
              <ul className="mb-3 space-y-1 text-sm">
                {/* acá van los items */}
              </ul>

              {/* TODO TP: mostrar el total del pedido y la fecha */}
              <p className="text-right text-sm text-muted">
                {/* acá va el total */}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
