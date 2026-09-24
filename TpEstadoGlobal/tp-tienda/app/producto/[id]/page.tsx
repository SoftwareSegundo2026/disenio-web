import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getProduct } from "@/lib/api";
import { AddToCartButton } from "@/components/AddToCartButton";
import { FavoriteButton } from "@/components/FavoriteButton";

/*
  Página de detalle de un producto.
  Componente de SERVIDOR: obtiene el producto de la API por su id.
  El id viene en la URL (ej: /producto/1).
*/

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let producto;
  try {
    producto = await getProduct(id);
  } catch {
    notFound();
  }

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
        <Image
          src={producto.thumbnail}
          alt={producto.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-4">
        <Link href="/" className="text-sm text-muted hover:text-primary">
          ← Volver
        </Link>

        <p className="text-xs uppercase tracking-wide text-muted">
          {producto.category} · {producto.brand}
        </p>
        <h1 className="text-3xl font-bold">{producto.title}</h1>
        <p className="text-muted">{producto.description}</p>

        <div className="flex items-center gap-4">
          <p className="text-3xl font-bold text-primary">
            {formatPrice(producto.price)}
          </p>
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>{producto.rating}</span>
          </div>
        </div>

        <p className="text-sm text-muted">Stock: {producto.stock}</p>

        <div className="flex items-center gap-4">
          <AddToCartButton product={producto} />
          <FavoriteButton productId={producto.id} />
        </div>
      </div>
    </article>
  );
}
