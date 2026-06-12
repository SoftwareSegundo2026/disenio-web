# Sonance Director Pro — Portal de Gestión Musical

Aplicación web administrativa para gestionar un catálogo de música: permite crear, ver, editar y eliminar **artistas, álbumes, géneros, canciones** y **usuarios**. También incluye un reproductor integrado con Deezer para previsualizar canciones y un panel de actividad en tiempo real.

Está construida con **Next.js 16** (App Router), **React 19**, **TypeScript** y **Tailwind CSS**. Se comunica con un backend externo (FastAPI) a través de una API REST.

---

## Requisitos previos

Antes de empezar, necesitás tener instalado en tu máquina:

| Herramienta       | Versión                    | Para qué sirve                                         |
| ----------------- | --------------------------- | ------------------------------------------------------- |
| **Node.js** | 20 o superior               | Entorno de ejecución de JavaScript                     |
| **pnpm**    | Cualquier versión reciente | Gestor de paquetes (más rápido que npm)               |
| **Git**     | Cualquier versión          | Control de versiones (ya lo tenés si clonaste el repo) |

### ¿Cómo verifico si ya los tengo?

Abrí una terminal y ejecutá:

```bash
node --version    # Debe mostrar v20.x.x o superior
pnpm --version    # Debe mostrar un número de versión
git --version     # Debe mostrar un número de versión
```

### ¿Cómo instalo lo que me falta?

- **Node.js**: Descargalo desde [https://nodejs.org](https://nodejs.org) (versión LTS 20+)
- **pnpm**: Una vez que tengas Node.js, ejecutá:
  ```bash
  npm install -g pnpm
  ```
- **Git**: Descargalo desde [https://git-scm.com](https://git-scm.com)

---

## Backend (API)

Esta app ***no funciona* **sin un backend. Necesitás tener corriendo una API REST en la dirección `http://127.0.0.1:8000` (o la que configures).

Si estás usando el backend de clase (FastAPI + SQLite), los pasos típicos son:

La API debe responder en `http://127.0.0.1:8000`.

---

## Instalación del frontend

### 1. Clonar el repositorio (si no lo hiciste ya)

```bash
git clone <url-del-repositorio>
cd musicbox-next
```

### 2. Instalar dependencias

```bash
pnpm install
```

Esto descarga todas las librerías que necesita el proyecto (React, Next.js, Tailwind, SweetAlert2, etc.) y las deja en la carpeta `node_modules`.

### 3. Configurar variables de entorno

El proyecto usa un archivo `.env` para configurar la conexión al backend y otras opciones.

```bash
cp .env.example .env
```

Abrí el archivo `.env` y verificá que los valores sean correctos:

| Variable                       | Valor típico                    | Qué hace                          |
| ------------------------------ | -------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_API_BASE`       | `http://127.0.0.1:8000/api/v1` | URL de la API REST                 |
| `NEXT_PUBLIC_API_ROOT`       | `http://127.0.0.1:8000`        | Raíz del backend (para imágenes) |
| `NEXT_PUBLIC_ROWS_PER_PAGE`  | `6`                            | Cuantos items mostrar por página  |
| `NEXT_PUBLIC_APP_NAME`       | `Sonance`                      | Nombre que aparece en la interfaz  |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `es`                           | Idioma (`es` o `en`)           |

### 4. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

La aplicación se abre en [http://localhost:3000](http://localhost:3000).

### 5. Build de producción (opcional)

```bash
pnpm build       # Compila todo para producción
pnpm start       # Inicia el servidor de producción
```

---

## Estructura del proyecto (vista rápida)

```
musicbox-next/
├── app/                     # Páginas y rutas (App Router)
│   ├── (auth)/              # Login, Register, Forgot Password
│   ├── (dashboard)/         # Panel principal con sidebar
│   │   ├── artists/         # CRUD de artistas
│   │   ├── albums/          # CRUD de álbumes
│   │   ├── genres/          # CRUD de géneros
│   │   ├── tracks/          # CRUD de canciones
│   │   └── users/           # Gestión de usuarios (solo admin)
│   ├── api/deezer/          # Proxy para búsqueda en Deezer
│   └── layout.tsx           # Layout raíz (fuentes, estilos globales)
├── components/              # Componentes reutilizables
│   ├── Sidebar.tsx          # Barra de navegación lateral
│   ├── Header.tsx           # Barra superior (login, menú)
│   ├── Pagination.tsx       # Paginación reutilizable
│   ├── DeezerPlayer.tsx     # Reproductor de Deezer embebido
│   └── ...                  # Modales de login, perfil, contraseñas
├── lib/
│   ├── db.ts                # Cliente API (todos los fetch al backend)
│   ├── config.ts            # Variables de entorno
│   ├── deezer.ts            # Búsqueda en Deezer
│   └── i18n/                # Traducciones (español / inglés)
└── public/                  # Archivos estáticos
```

---

## Cómo usar la app

1. **Iniciá sesión** con un usuario existente (botón **Login** en el header)
2. Si no tenés usuario, un admin puede crear uno desde **Users → Add User**
3. Navegá por las secciones usando el **sidebar** (artistas, álbumes, géneros, tracks)
4. Para **crear/editar/eliminar** necesitás ser **admin**
5. El **Dashboard** muestra estadísticas y actividad reciente

### Rutas principales

| Ruta                | Qué hace                           |
| ------------------- | ----------------------------------- |
| `/artists`        | Lista de artistas (con paginación) |
| `/artists/new`    | Crear nuevo artista                 |
| `/artists/1`      | Ver detalle del artista con ID 1    |
| `/artists/1/edit` | Editar artista con ID 1             |
| `/albums`         | Lista de álbumes                   |
| `/tracks`         | Lista de canciones                  |
| `/genres`         | Lista de géneros                   |
| `/users`          | Lista de usuarios (solo admin)      |

---

## Variables de Entorno

| Variable                       | Requerida | Por Defecto                      | Descripción                       |
| ------------------------------ | --------- | -------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_API_BASE`       | Sí       | `http://127.0.0.1:8000/api/v1` | URL base de la API del backend     |
| `NEXT_PUBLIC_API_ROOT`       | Sí       | `http://127.0.0.1:8000`        | Raíz del backend (para imágenes) |
| `NEXT_PUBLIC_ROWS_PER_PAGE`  | No        | `6`                            | Items por página en listas        |
| `NEXT_PUBLIC_APP_NAME`       | No        | `Sonance`                      | Nombre de la aplicación           |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | No        | `es`                           | Idioma (`es` o `en`)           |

---

## Comandos útiles

```bash
pnpm dev       # Iniciar servidor de desarrollo
pnpm build     # Compilar para producción
pnpm start     # Iniciar servidor de producción
pnpm lint      # Verificar estilo de código
pnpm install   # Instalar dependencias
```

---

## Tecnologías usadas

- **Next.js 16** — Framework de React con App Router
- **React 19** — Librería de interfaces de usuario
- **TypeScript** — JavaScript con tipos
- **Tailwind CSS** — Framework de estilos
- **SweetAlert2** — Diálogos y alertas
- **Deezer API** — Reproductor de música embebido

---

> Proyecto desarrollado con fines educativos — Materia Desarrollo Web
