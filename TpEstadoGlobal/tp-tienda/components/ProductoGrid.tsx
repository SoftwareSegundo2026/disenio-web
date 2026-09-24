"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { searchProducts } from "@/lib/api";
import { useSearchStore } from "@/lib/stores/search-store";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";

/*
  Grilla de productos (componente de CLIENTE).

  - Recibe del servidor los productos iniciales y los datos de paginación.
  - Lee el término de búsqueda del store global (search-store).
  - Si el término está vacío, muestra los productos recibidos por props.
  - Si hay término, busca en la API y muestra los resultados.

  NOTA: hasta que completes setTermino en search-store.ts,
  el término siempre va a estar vacío y se muestran los productos iniciales.
*/

export function ProductoGrid({
  productosIniciales,
  total,
  pagina,
  categoria,
}: {
  productosIniciales: Product[];
  total: number;
  pagina: number;
  categoria: string;
}) {
  const termino = useSearchStore((s) => s.termino);
  const [resultados, setResultados] = useState<Product[] | null>(null);
  const [cargando, setCargando] = useState(false);

  // Cada vez que cambia el término, buscamos (o volvemos al listado).
  useEffect(() => {
    if (!termino.trim()) {
      setResultados(null);
      return;
    }

    let activo = true;
    setCargando(true);
    searchProducts(termino)
      .then((productos) => {
        if (activo) setResultados(productos);
      })
      .catch(() => {
        if (activo) setResultados([]);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [termino]);

  const hayBusqueda = termino.trim() !== "";
  const productos = hayBusqueda ? resultados : productosIniciales;

  return (
    <>
      {hayBusqueda && (
        <p className="mb-4 text-sm text-muted">
          Resultados para “{termino}” ({productos?.length ?? 0})
        </p>
      )}

      {cargando ? (
        <p className="py-16 text-center text-muted">Buscando...</p>
      ) : productos && productos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productos.map((producto) => (
            <ProductCard key={producto.id} product={producto} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-muted">
          No se encontraron productos.
        </p>
      )}

      {!hayBusqueda && (
        <Pagination total={total} page={pagina} categoria={categoria} />
      )}
    </>
  );
}
