import { config } from "./config";
import type { Category, Product, ProductsResponse } from "./types";

/*
  Cliente de la API DummyJSON (https://dummyjson.com/docs/products).
  Todas las funciones devuelven datos reales de productos.
  La URL base se toma de lib/config.ts (variable NEXT_PUBLIC_API_BASE).
*/

export async function getProducts(
  limit: number,
  skip: number,
  category?: string,
): Promise<ProductsResponse> {
  const categoria =
    category && category !== "all" ? `/category/${category}` : "";
  const url = `${config.apiBase}/products${categoria}?limit=${limit}&skip=${skip}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Error al obtener productos: ${res.status}`);
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const url = `${config.apiBase}/products/categories`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Error al obtener categorías: ${res.status}`);
  return res.json();
}

export async function getProduct(id: string): Promise<Product> {
  const url = `${config.apiBase}/products/${id}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Error al obtener producto: ${res.status}`);
  return res.json();
}

export async function searchProducts(termino: string): Promise<Product[]> {
  const url = `${config.apiBase}/products/search?q=${encodeURIComponent(termino)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Error al buscar productos: ${res.status}`);
  const data: ProductsResponse = await res.json();
  return data.products;
}

export function formatPrice(precio: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
  }).format(precio);
}
