"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProduct } from "@/lib/api";
import { useFavoritesStore } from "@/lib/stores/favorites-store";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

/*
  Página de favoritos (componente de CLIENTE).

  TODO TP: completá esta página para listar los productos favoritos.

  - Lee los ids de favoritos del store (useFavoritesStore).
  - En el store guardamos solo los ids. Para mostrar los productos
    completos hay DOS opciones (elegí una y justificá en about):
      1. Guardar el producto completo en el store en lugar del id.
      2. Buscar cada id en la API con getProduct(id) (ya está importada).
  - Esta implementación usa la opción 2: busca los productos por id.
  - El botón "Quitar" vacía los favoritos (clearFavorites) o podés
    permitir quitar de a uno con toggleFavorite.

  Estado actual: si el store funciona (ver lib/stores/favorites-store.ts),
  busca los productos favoritos y los muestra con ProductCard.
*/

export default function FavoritosPage() {
  const ids = useFavoritesStore((s) => s.ids);
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites);
  const [productos, setProductos] = useState<Product[]>([]);

  useEffect(() => {
    let activo = true;
    Promise.all(ids.map((id) => getProduct(String(id))))
      .then((resultados) => {
        if (activo) setProductos(resultados);
      })
      .catch(() => {
        if (activo) setProductos([]);
      });
    return () => {
      activo = false;
    };
  }, [ids]);

  if (ids.length === 0) {
    return (
      <section className="py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">No tenés favoritos</h1>
        <p className="mb-6 text-muted">
          Tocá el corazón en cualquier producto para guardarlo acá.
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Favoritos ({ids.length})</h1>
        {/* TODO TP: decidir el comportamiento de este botón */}
        <button
          onClick={clearFavorites}
          className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:text-red-500 dark:border-gray-700"
        >
          Vaciar favoritos
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {productos.map((producto) => (
          <ProductCard key={producto.id} product={producto} />
        ))}
      </div>
    </section>
  );
}
