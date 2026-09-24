# tp-tienda

Proyecto base del Trabajo Práctico de estado global (**Zustand + Context API**).

La tienda ya funciona: muestra productos reales de la API DummyJSON, tiene carrito con
persistencia, cambio de tema claro/oscuro y comentarios. Tu trabajo es **extenderla**
usando las mismas técnicas.

## Empezar

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000) y probá la tienda: agregá productos
al carrito, cambiá de tema y publicá un comentario.

> Consigna con todo el detalle: `../consigna_trabajo_practico.md`

## Cómo está armado el proyecto

```
tp-tienda/
├── app/
│   ├── page.tsx                    # Listado de productos (paginación + categorías + búsqueda)
│   ├── producto/[id]/page.tsx      # Detalle de un producto
│   ├── carrito/page.tsx            # Página del carrito (lee el store de Zustand)
│   ├── about/page.tsx              # "Acerca de" (a completar por vos)
│   ├── comentarios/page.tsx        # Comentarios guardados en JSON (ejemplo completo)
│   ├── checkout/page.tsx           # Checkout (a completar por vos)
│   ├── favoritos/page.tsx          # Favoritos (a completar por vos)
│   ├── pedidos/page.tsx            # Pedidos (a completar por vos)
│   └── api/
│       ├── comentarios/route.ts    # API de comentarios (ejemplo completo)
│       └── pedidos/route.ts        # API de pedidos (a completar por vos)
├── components/                     # Navbar, ProductCard, AddToCartButton, etc.
├── lib/
│   ├── api.ts                      # Funciones para consultar DummyJSON
│   ├── config.ts                   # Variables de entorno
│   ├── types.ts                    # Tipos (Product, CartItem, Order, etc.)
│   ├── stores/
│   │   ├── cart-store.ts           # Carrito con Zustand (EJEMPLO COMPLETO a copiar)
│   │   ├── favorites-store.ts      # Favoritos (a completar por vos)
│   │   └── search-store.ts         # Búsqueda (a completar por vos)
│   └── context/
│       └── theme-context.tsx       # Tema claro/oscuro con Context (EJEMPLO COMPLETO)
└── data/                           # comentarios.json y pedidos.json
```

## Qué ya está completo (usalo de referencia)

- **Carrito** con Zustand + `persist` → `lib/stores/cart-store.ts`
- **Tema** claro/oscuro con Context API → `lib/context/theme-context.tsx`
- **Comentarios** con route handler (GET/POST sobre JSON) → `app/api/comentarios/route.ts` y `app/comentarios/page.tsx`

## Qué tenés que entregar y cómo

### 1. Store de favoritos (Zustand + persistencia)

Completá `lib/stores/favorites-store.ts` copiando el patrón de `cart-store.ts`:

- Estado: `ids: number[]`.
- Acciones: `toggleFavorite(productId)` (lo agrega si no está, lo quita si ya está) y `clearFavorites()`.
- Que persista en `localStorage` con la clave `tienda-favoritos`.

Luego conectalo:
- `components/FavoriteButton.tsx`: el corazón debe llamar a `toggleFavorite` y verse lleno (❤️) si el producto está en favoritos.
- `app/favoritos/page.tsx`: listá los favoritos. Elegí entre guardar el producto completo en el store o buscar cada id con `getProduct(id)` — justificá la elección en la página "Acerca de".

### 2. Búsqueda con estado global (Zustand)

Completá `lib/stores/search-store.ts`:

- Estado: `termino: string`.
- Acción: `setTermino(texto)`.
- El campo del `Navbar` ya está conectado al store; cuando completes la acción va a escribir el término.
- El listado de `app/page.tsx` ya reacciona: si `termino` no está vacío usa `/products/search?q=...` (función `searchProducts` en `lib/api.ts`) y vuelve al listado normal al borrarlo.

### 3. Checkout y pedidos guardados en JSON

Guíate por la API de comentarios (mismo patrón de leer/escribir JSON):

- `app/api/pedidos/route.ts`: completá `POST` para agregar un pedido a `data/pedidos.json`. El `GET` ya está hecho. El tipo `Order` está en `lib/types.ts`.
- `app/checkout/page.tsx`: al confirmar, armá el pedido (`{ customer, items, total, createdAt }`), enviálo con `POST /api/pedidos`, vaciá el carrito con `clearCart()` y navegá a `/pedidos`.
- `app/pedidos/page.tsx`: mostrá los pedidos con sus items (cantidad y subtotal), total y fecha.

### 4. Página "Acerca de"

Completá `app/about/page.tsx` con tus datos (apellido, nombre, asignatura, mail) y explicá con tus palabras:

- Qué es **Zustand** y para qué sirve el middleware `persist`.
- Qué es la **Context API** y cuándo conviene usarla.
- En qué casos usarías Zustand y en qué casos Context.

## Verificá que funcione

- **Favoritos**: agregar y quitar desde el listado, y verlos en `/favoritos`.
- **Búsqueda**: escribir en el buscador y que el listado filtre; borrar y que vuelva.
- **Checkout**: armar un carrito, completar el formulario, confirmar y ver el pedido en `/pedidos`.
- **Persistencia**: carrito y favoritos deben seguir guardados al recargar la página.

## Qué se evalúa

- Que la app funcione de punta a punta.
- Que se note que entendiste el estado global con **Zustand** y con **Context**.
- Que el código esté ordenado y separado en componentes reutilizables.
- Que la persistencia funcione.
- Que el diseño sea limpio y con HTML semántico (`Navbar`, `Main`, `Footer`).
