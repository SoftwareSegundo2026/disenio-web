# Sonance Director Pro

**Portal Administrativo para Gestión de Catálogos**

Sonance Director Pro es una interfaz administrativa web para la gestión de un catálogo musical. Provee operaciones CRUD para artistas, álbumes, géneros, pistas y usuarios de la plataforma, junto con monitoreo de actividad, integración con Deezer para previsualización de pistas y control de acceso basado en roles.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2.7 (App Router) |
| Lenguaje | TypeScript 6.0 |
| Librería UI | React 19.2.4 |
| Estilos | Tailwind CSS v4 (tema oscuro, tokens de diseño personalizados) |
| Iconos | Google Material Symbols Outlined |
| Diálogos | SweetAlert2 |
| Gestor de Paquetes | pnpm |
| Backend API | FastAPI (externo, REST + JSON) |

---

## Arquitectura

### Enrutamiento (Next.js App Router)

```
/                  → Dashboard
/login             → Inicio de sesión
/register          → Registro de usuario
/forgot-password   → Recuperación de contraseña

/artists           → Lista de artistas (paginada)
/artists/new       → Crear artista
/artists/[id]      → Detalle de artista
/artists/[id]/edit → Editar artista

/albums            → Lista de álbumes (paginada)
/albums/new        → Crear álbum
/albums/[id]       → Detalle de álbum
/albums/[id]/edit  → Editar álbum

/genres            → Lista de géneros (paginada)
/genres/new        → Crear género
/genres/[id]       → Detalle de género
/genres/[id]/edit  → Editar género

/tracks            → Lista de pistas (paginada)
/tracks/new        → Crear pista
/tracks/[id]       → Detalle de pista + reproductor Deezer
/tracks/[id]/edit  → Editar pista

/users             → Lista de usuarios (solo admin, paginada)
/users/new         → Crear usuario
/users/[id]/edit   → Editar usuario
```

Dos grupos de rutas separan los layouts:
- `(auth)` — Layout de tarjeta centrada para login/register/forgot-password
- `(dashboard)` — Layout con Sidebar + Header + contenido principal para todas las páginas de gestión

### Autenticación & Autorización

**Flujo:**
1. El usuario envía credenciales mediante `POST /auth/token`
2. El JWT se almacena en `localStorage` bajo `access_token`
3. `storeCurrentUser()` ejecuta `GET /users/me` para obtener datos del perfil (`user_id`, `full_name`, `email`, `is_admin`, `username`) y los persiste en `localStorage`
4. `getIsAdmin()` lee `localStorage.getItem("is_admin")` — el JWT no contiene claims de roles
5. Eventos personalizados (`auth:login`, `auth:expired`) disparan actualizaciones reactivas de UI en Sidebar y Header
6. La expiración de sesión (HTTP 401) dispara automáticamente `logout()` a través del helper `request()`

**Capa de autorización:**
- `<RequireAuth adminOnly={true}>` envuelve botones de acción (crear, editar, eliminar)
- Usa `onClickCapture` para interceptar clicks en elementos no autorizados — siempre renderiza hijos, muestra advertencia SweetAlert2 si el usuario no tiene permiso
- `adminOnly` por defecto es `true`

### Cliente API (`lib/db.ts`)

Cliente HTTP centralizado que exporta funciones tipadas para cada operación del backend:

| Categoría | Funciones |
|---|---|
| Auth | `loginApi`, `storeCurrentUser`, `fetchCurrentUser`, `logout`, `getToken`, `setToken` |
| CRUD | `getAll`, `getAllProtected`, `getById`, `getByIdProtected`, `create`, `update`, `remove` |
| Usuarios | `changeMyPassword`, `resetUserPassword` |
| Actividades | `getActivities` |
| Media | `uploadImage`, `fetchImageFromUrl` |
| Almacenamiento | `getStoredUserId`, `getStoredFullName`, `getIsAdmin`, `getImageUrl` |

Decisiones de diseño clave:
- Las peticiones `GET` **no** envían `Authorization` ni `Content-Type` (el backend las trata como públicas)
- Todas las mutaciones (`POST`, `PATCH`, `DELETE`) inyectan `Authorization: Bearer <token>`
- `storeCurrentUser()` tiene un timeout de 15 segundos para evitar que el login se bloquee
- La subida de imágenes usa `fetch` directo con `FormData` (multipart) en lugar del helper genérico `request()`

### Internacionalización (`lib/i18n/`)

Sistema de i18n propio de clave-valor sin dependencias externas:

- Dos diccionarios JSON: `en.json` (inglés) y `es.json` (español) — ~372 claves cada uno
- El diccionario se selecciona en tiempo de ejecución según la variable de entorno `NEXT_PUBLIC_DEFAULT_LOCALE` (por defecto: `es`)
- `t(key, params?)` — busca la clave, reemplaza placeholders `{param}`, fallback a la clave original
- `formatDate(dateStr)` — parsea fechas ISO, formatea con `toLocaleString` según el locale
- Todos los textos visibles al usuario usan `t()` — no hay texto hardcodeado fuera de los archivos i18n

### Integración con Deezer

**Previsualización de pistas** en las páginas de detalle:
1. El cliente llama a `lib/deezer.ts → searchDeezerTrack()`
2. La ruta API proxy `GET /api/deezer/search?q=...&limit=5` reenvía a `https://api.deezer.com/search/track`
3. El proxy server-side maneja CORS y provee caché ISR (`revalidate: 3600`)
4. En caso de éxito, renderiza un iframe de Deezer (`https://widget.deezer.com/widget/auto/track/{id}?autoplay=true`) con controles completos de reproducción
5. Si no encuentra la pista, muestra un mensaje de "no encontrada"

### Páginas de Autenticación (Login / Register / Forgot Password)

Las tres páginas de autenticación usan:
- `t()` para todas las etiquetas, placeholders, mensajes de validación y texto de botones
- Toggle de visibilidad de contraseña (ícono de ojo) en todos los campos de contraseña
- `NEXT_PUBLIC_APP_NAME` para la marca (por defecto: "Sonance")
- SweetAlert2 para retroalimentación de éxito/error
- `finally { setIsSubmitting(false) }` para evitar botones trabados

---

## Variables de Entorno

| Variable | Requerida | Por Defecto | Descripción |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE` | Sí | `http://127.0.0.1:8000/api/v1` | URL base de la API del backend |
| `NEXT_PUBLIC_API_ROOT` | Sí | `http://127.0.0.1:8000` | Raíz del backend (para resolución de URLs de imágenes) |
| `NEXT_PUBLIC_ROWS_PER_PAGE` | No | `6` | Tamaño de página por defecto en paginación |
| `NEXT_PUBLIC_APP_NAME` | No | `Sonance` | Nombre de marca de la aplicación |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | No | `es` | Locale por defecto para i18n (`en` o `es`) |

Todas las variables se leen en `lib/config.ts` y se exportan como un objeto `config` tipado.

---

## Primeros Pasos

### Prerrequisitos

- Node.js 20+
- pnpm (recomendado) o npm
- Backend API ejecutándose en la URL configurada en `.env`

### Instalación

```bash
pnpm install
```

### Configuración

Copiar el archivo de entorno de ejemplo y ajustar según sea necesario:

```bash
cp .env.example .env
```

### Desarrollo

```bash
pnpm dev
```

Abre en `http://localhost:3000`.

### Build de Producción

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

---

## Estructura del Proyecto

```
├── app/
│   ├── (auth)/                  # Páginas de autenticación (login, register, forgot-password)
│   │   ├── layout.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/             # Páginas del panel administrativo
│   │   ├── layout.tsx           # Layout con Sidebar + Header
│   │   ├── page.tsx             # Dashboard principal
│   │   ├── albums/              # CRUD de álbumes (lista, detalle, nuevo, editar)
│   │   ├── artists/             # CRUD de artistas
│   │   ├── genres/              # CRUD de géneros
│   │   ├── tracks/              # CRUD de pistas
│   │   └── users/               # Gestión de usuarios (solo admin)
│   ├── api/deezer/search/       # Proxy de búsqueda Deezer (server-side)
│   ├── globals.css              # Tema Tailwind + tokens de diseño
│   └── layout.tsx               # Layout raíz (fuentes, metadatos)
│
├── components/
│   ├── ChangePasswordModal.tsx   # Cambio de contraseña (autoservicio)
│   ├── DeezerPlayer.tsx          # Wrapper del widget iframe de Deezer
│   ├── Header.tsx                # Barra superior (búsqueda, login, menú de usuario)
│   ├── LoginModal.tsx            # Diálogo de inicio de sesión (versión en Header)
│   ├── Pagination.tsx            # Controles de paginación reutilizables
│   ├── ProfileEditModal.tsx      # Editar perfil (full_name, email)
│   ├── RequireAuth.tsx           # Guardia de autorización
│   ├── ResetPasswordModal.tsx    # Restablecimiento de contraseña por admin
│   ├── Sidebar.tsx               # Barra lateral de navegación
│   └── UserMenu.tsx              # Menú desplegable de usuario (perfil, cambiar contraseña)
│
├── lib/
│   ├── config.ts                 # Acceso a variables de entorno
│   ├── db.ts                     # Cliente API (todos los endpoints, helpers de auth)
│   ├── deezer.ts                 # Cliente de búsqueda Deezer
│   └── i18n/
│       ├── index.ts              # Funciones t() y formatDate()
│       ├── en.json               # Traducciones al inglés
│       └── es.json               # Traducciones al español
│
├── public/                       # Assets estáticos
├── .env.example                  # Template de entorno
├── next.config.mjs               # Configuración de Next.js
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── eslint.config.mjs
```

---

## Librería de Componentes

### Componentes Reutilizables

| Componente | Propósito |
|---|---|
| `Sidebar` | Navegación con visibilidad condicional para Users y Quick Actions (según rol) |
| `Header` | Barra superior sticky con búsqueda, botón de login/logout y `UserMenu` |
| `UserMenu` | Menú desplegable con opciones de Perfil y Cambiar Contraseña |
| `Pagination` | Paginación skip/limit con contador de páginas |
| `RequireAuth` | Envoltorio de autorización usando `onClickCapture` + SweetAlert2 |
| `DeezerPlayer` | Búsqueda de pista + widget iframe de Deezer |
| `LoginModal` | Diálogo de inicio de sesión (usado en Header) |

### Componentes Modales

Los modales se renderizan **fuera** del `<header>` sticky para evitar que `backdrop-filter` rompa `position: fixed`:

| Modal | Disparador | Propósito |
|---|---|---|
| `ChangePasswordModal` | UserMenu → Cambiar Contraseña | Cambio de contraseña (autoservicio) |
| `ResetPasswordModal` | Lista de usuarios → ícono de llave | Restablecimiento de contraseña por admin |
| `ProfileEditModal` | UserMenu → Perfil | Editar full_name y email |

---

## Contrato de API del Backend

Todos los endpoints son relativos a `NEXT_PUBLIC_API_BASE`.

### Colecciones (`/artists`, `/albums`, `/genres`, `/tracks`, `/users`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/{collection}` | No | Listar (soporta `?skip=&limit=`) |
| GET | `/{collection}/{id}` | No | Obtener por ID |
| POST | `/{collection}` | Sí | Crear |
| PATCH | `/{collection}/{id}` | Sí | Actualizar |
| DELETE | `/{collection}/{id}` | Sí | Eliminar |

### Auth & Usuarios

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/token` | No | Inicio de sesión (retorna JWT) |
| GET | `/users/me` | Sí | Perfil del usuario actual |
| PATCH | `/users/me/password` | Sí | Cambiar propia contraseña |
| PATCH | `/users/{id}/password` | Sí | Admin restablece contraseña |
| POST | `/{collection}/{id}/image` | Sí | Subir imagen (multipart) |
| POST | `/{collection}/{id}/fetch-image` | Sí | Obtener imagen desde URL |

### Actividades

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/activities` | No | Listar actividades (soporta `?skip=&limit=`) |

---

## Decisiones de Diseño

- **localStorage para estado de auth** en lugar de cookies o sesiones de servidor — simplifica la arquitectura para una experiencia tipo SPA API-first dentro de Next.js
- **`is_admin` desde `/users/me`** en lugar de decodificar el JWT — el token del backend no contiene claims de roles
- **i18n personalizado** en lugar de `react-intl` o `next-intl` — cero dependencias runtime, búsquedas clave-valor simples suficientes para el alcance
- **Widget iframe de Deezer** en lugar de `HTMLAudioElement` nativo — controles completos de reproducción (volumen, seek) sin librerías adicionales
- **`onClickCapture` en RequireAuth** — intercepta clicks antes de que los manejadores de eventos hijos se disparen, preservando la estructura del hijo (sin envolver en divs deshabilitados ni renderizado condicional)
- **Modales fuera del header sticky** — `backdrop-filter` en CSS crea un nuevo containing block, rompiendo `position: fixed` para modales renderizados dentro de él
- **Endpoints GET públicos** — el backend permite lecturas no autenticadas para todas las colecciones; solo las mutaciones requieren auth
- **`formatDate()` centralizada** — evita llamadas `toLocaleString` dispersas, respeta el locale desde la configuración

---

## Convenciones

- Todo el texto visible al usuario usa `t("key")` — nunca hardcodear strings
- La retroalimentación de error/éxito usa diálogos SweetAlert2 para mutaciones, texto inline para validación de formularios
- La paginación usa `skip`/`limit` del backend (configurable via `NEXT_PUBLIC_ROWS_PER_PAGE`)
- Las funcionalidades solo-admin (nav Users, Quick Actions) se ocultan de usuarios no administradores a nivel de layout
- Todos los botones de envío de formularios tienen estado `isSubmitting` para evitar doble envío
- Los campos de contraseña siempre tienen un toggle de visibilidad
- Las imágenes usan el helper `getImageUrl()` para resolver rutas relativas contra la raíz del backend
