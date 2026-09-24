# Trabajo Práctico: Tienda con carrito y estado global (Zustand + Context)

En este TP vas a trabajar sobre un proyecto base que ya funciona: una tienda online que muestra productos reales (API DummyJSON), tiene carrito, cambio de tema claro/oscuro y comentarios.

El proyecto base está armado para que veas **cómo se maneja el estado global** con dos técnicas:

- **Zustand**: para el carrito (con persistencia en `localStorage`).
- **Context API**: para el tema claro/oscuro.

Tu trabajo es **extender** ese proyecto usando esas mismas técnicas: agregar favoritos, búsqueda con estado global, checkout con pedidos guardados en JSON, y completar la página "Acerca de" explicando lo que aprendiste.

## Empezar

1. Instalá las dependencias:

   ```bash
   cd tp-tienda
   pnpm install
   ```

2. Copiá el archivo de ambiente:

   ```bash
   cp .env.example .env.local
   ```

3. Iniciá el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

4. Abrí [http://localhost:3000](http://localhost:3000) y probá la tienda (agregar al carrito, cambiar de tema, comentar).

## Cómo está armado el proyecto base

```
tp-tienda/
├── app/
│   ├── page.tsx                    # Listado de productos (con paginación y filtros)
│   ├── producto/[id]/page.tsx      # Detalle de un producto
│   ├── carrito/page.tsx            # Página del carrito (lee el store de Zustand)
│   ├── about/page.tsx              # Página "Acerca de" (a completar por vos)
│   ├── comentarios/page.tsx        # Comentarios guardados en JSON
│   └── api/
│       ├── comentarios/route.ts    # API que lee/guarda comentarios en JSON
│       └── pedidos/route.ts        # API de pedidos (a completar por vos)
├── components/                     # Componentes reutilizables
├── lib/
│   ├── api.ts                      # Funciones para consultar la API DummyJSON
│   ├── config.ts                   # Variables de entorno
│   ├── types.ts                    # Tipos (Product, CartItem, etc.)
│   ├── stores/
│   │   ├── cart-store.ts           # Store del carrito con Zustand (ejemplo completo)
│   │   ├── favorites-store.ts      # Store de favoritos (a completar por vos)
│   │   └── search-store.ts         # Store de búsqueda (a completar por vos)
│   └── context/
│       └── theme-context.tsx       # Tema claro/oscuro con Context API (ejemplo completo)
└── data/                           # Archivos JSON donde se guardan comentarios/pedidos
```

## Lo que tenés que hacer

### 1. Store de favoritos (Zustand + persistencia)

Mirá cómo está hecho `lib/stores/cart-store.ts` (usa `create`, `persist` y `createJSONStorage`). Ahora completá `lib/stores/favorites-store.ts` para guardar los ids de los productos favoritos:

- Estado: `ids: number[]`.
- Acciones: `toggleFavorite(productId)` (agrega si no está, lo quita si ya está), `clearFavorites()`.
- Que persista en `localStorage` con un nombre de clave propio (ej: `tienda-favoritos`).

Luego conectalo:

- En `components/FavoriteButton.tsx`: el botón corazón debe llamar a `toggleFavorite` y mostrarse lleno si el producto está en favoritos.
- En `app/favoritos/page.tsx`: listar los productos favoritos. Para mostrar los datos del producto podés guardar el producto completo en el store en lugar del id, o hacer un `fetch` a la API. Elegí una y explicá por qué.
- El corazón ya aparece en cada `ProductCard`, solo falta el comportamiento.

### 2. Búsqueda con estado global (Zustand)

Completá `lib/stores/search-store.ts`:

- Estado: `termino: string`.
- Acción: `setTermino(termino)`.
- Conectá el campo de búsqueda del `Navbar` para que escriba en el store.
- Hacé que el listado de `app/page.tsx` reaccione al término: si `termino` no está vacío, usar el endpoint `/products/search?q=...` de DummyJSON (ya tenés la función en `lib/api.ts`), y volver al listado normal cuando se borra.

### 3. Checkout y pedidos guardados en JSON

- Completá `app/checkout/page.tsx`: un formulario con nombre, mail y dirección. Al confirmar, guardar el pedido (los items del carrito, el total y la fecha/hora) llamando a `POST /api/pedidos`, y luego vaciar el carrito con `clearCart()`.
- Completá `app/api/pedidos/route.ts`: hacer `GET` (devuelve todos los pedidos guardados) y `POST` (agrega uno nuevo a `data/pedidos.json`). Guíate por cómo está hecha la API de comentarios.
- Completá `app/pedidos/page.tsx`: mostrar los pedidos guardados con sus items, total y fecha.

### 4. Página "Acerca de"

Completá `app/about/page.tsx` con:

- Tus datos: apellido, nombre, asignatura y mail.
- Una explicación simple, con tus palabras, de:
  - Qué es **Zustand** y para qué sirve el middleware `persist`.
  - Qué es la **Context API** de React y cuándo conviene usarla.
  - En qué casos usarías Zustand y en qué casos Context.

### 5. Verificá que funcione

- Favoritos: agregar y quitar favoritos desde el listado, y verlos en `/favoritos`.
- Búsqueda: escribir en el buscador del Navbar y que el listado filtre.
- Checkout: armar un carrito, completar el formulario, confirmar el pedido y verlo en `/pedidos`.
- El carrito y los favoritos deben seguir guardados al recargar la página (persistencia).

## Qué se espera

- Que la aplicación funcione bien de punta a punta.
- Que se note que entendiste el manejo de estado global con **Zustand** y con **Context**.
- Que el código esté ordenado y separado en componentes reutilizables.
- Que la persistencia funcione (recargar no borra el carrito ni los favoritos).
- Que el diseño siga siendo limpio y prolijo, con HTML semántico (Navbar, Main, Footer).
- Que puedas explicar con tus palabras qué es un store global y por qué es útil.

## Tecnologías

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Zustand 5** (estado global del carrito y favoritos)
- **Context API** (tema claro/oscuro)
- **API DummyJSON** (productos reales) — https://dummyjson.com/docs/products