"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/api";
import { AddToCartButton } from "@/components/AddToCartButton";
import { FavoriteButton } from "@/components/FavoriteButton";

/*
  Tarjeta de producto que se muestra en el listado y en favoritos.
  Recibe un producto como prop y renderiza su imagen, título,
  precio y los botones de acción (carrito + corazón).
*/

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-muted">
          {product.category}
        </p>
        <Link href={`/producto/${product.id}`}>
          <h3 className="line-clamp-1 font-semibold hover:text-primary">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          <FavoriteButton productId={product.id} />
        </div>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
