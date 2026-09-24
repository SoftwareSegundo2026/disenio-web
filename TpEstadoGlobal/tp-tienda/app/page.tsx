import { getCategories, getProducts } from "@/lib/api";
import { config } from "@/lib/config";
import { ProductoGrid } from "@/components/ProductoGrid";
import type { Category } from "@/lib/types";

/*
  Página de inicio: listado de productos con paginación y filtro
  por categoría.

  - La página es un componente de SERVIDOR: consulta la API
    DummyJSON y pasa los datos a ProductoGrid.
  - Categoria y número de página llegan por la URL (?categoria=...&pagina=...).
  - La búsqueda se maneja del lado del cliente en ProductoGrid,
    leyendo el store de búsqueda (search-store).
*/

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; pagina?: string }>;
}) {
  const params = await searchParams;
  const categoria = params.categoria || "all";
  const pagina = Number(params.pagina || "1");

  const skip = (pagina - 1) * config.rowsPerPage;
  const [data, categorias] = await Promise.all([
    getProducts(config.rowsPerPage, skip, categoria),
    getCategories(),
  ]);

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Nuestros productos</h1>

      {/* Filtro por categoría */}
      <div className="mb-8 flex flex-wrap gap-2">
        <a
          href="/"
          className={`rounded-full px-4 py-1.5 text-sm ${
            categoria === "all"
              ? "bg-primary text-white"
              : "border border-border text-muted hover:border-primary hover:text-primary dark:border-gray-700"
          }`}
        >
          Todas
        </a>
        {categorias.map((c: Category) => (
          <a
            key={c.slug}
            href={`/?categoria=${c.slug}`}
            className={`rounded-full px-4 py-1.5 text-sm capitalize ${
              categoria === c.slug
                ? "bg-primary text-white"
                : "border border-border text-muted hover:border-primary hover:text-primary dark:border-gray-700"
            }`}
          >
            {c.name}
          </a>
        ))}
      </div>

      <ProductoGrid
        productosIniciales={data.products}
        total={data.total}
        pagina={pagina}
        categoria={categoria}
      />
    </section>
  );
}
