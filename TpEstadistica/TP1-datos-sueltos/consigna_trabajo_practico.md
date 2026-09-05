# Trabajo Práctico 1: Dashboard estadístico con datos sueltos

En este TP vas a construir desde cero una aplicación **Next.js + Tailwind** que consuma conjuntos de datos (JSON) y los analice con estadística descriptiva: **tablas de frecuencias, medidas de tendencia central (media, mediana, moda) y medidas de dispersión (varianza, desvío medio, desvío estándar)**.

Todo sobre **datos sueltos** (no agrupados): los mismos conceptos que ya viste en clase, pero aplicados a datasets reales que tu app carga con `fetch()` y muestra con un diseño propio.

## Empezar

1. Creá el proyecto:

   ```bash
   npx create-next-app@latest estadistica-tp1
   ```

   Elegí: TypeScript, Tailwind CSS, App Router. El resto de opciones a tu criterio.

2. Copiá los datasets:

   ```bash
   cd estadistica-tp1
   mkdir -p public/data
   cp -r <ruta-a>/TP1-datos-sueltos/data/* public/data/
   ```

   Con esto quedan accesibles como `/data/indice.json`, `/data/edades-alumnos.json`, etc.

3. Probá que el JSON se sirva: abrí [http://localhost:3000/data/indice.json](http://localhost:3000/data/indice.json).

## Estructura del dataset

Cada archivo de `data/` tiene esta forma:

```json
{
  "id": "edades-alumnos",
  "titulo": "Edades de los alumnos",
  "descripcion": "Edades (en años) de 30 alumnos de 1er año de secundaria.",
  "unidad": "años",
  "valores": [15, 15, 16, 16, 16, ...]
}
```

Y `indice.json` lista todos los datasets disponibles con su ruta, para que el listado de la home se arme dinámicamente con `fetch()`.

## Lo que tenés que hacer

### 1. Listado de datasets (home)

- La página principal debe consumir `/data/indice.json` y mostrar una **grilla de tarjetas**, una por dataset, con su título, descripción y cantidad de datos.
- Cada tarjeta debe navegar a `/dataset/[id]` con el id del dataset.
- Diseño libre pero prolijo: pensá en tipografía, colores y jerarquía. Acá se evalúa tu criterio de diseño.

### 2. Página de detalle `/dataset/[id]`

La página debe:

1. **Cargar el dataset** con `fetch(\`/data/${id}.json\`)`. Si el id no existe, mostrar una pantalla de "no encontrado" bien diseñada (sin romper).
2. **Mostrar los datos sueltos**: los valores en una grilla de chips o en una tabla, siempre ordenados de menor a mayor.
3. **Tabla de frecuencias**: columnas `Valor (xi)`, `Frecuencia (fi)`, `Frecuencia acumulada (Fi)`, `Frecuencia relativa (fr)` y `Frecuencia porcentual (fr%)`.
4. **Medidas de tendencia central** en tarjetas:
   - **Media aritmética** (x̄ = Σxi / n)
   - **Mediana** (valor central; si n es par, promedio de los dos centrales)
   - **Moda** (valor/es con mayor frecuencia — puede haber más de una)
5. **Medidas de dispersión** en tarjetas:
   - **Varianza** (σ² = Σ(xi − x̄)² / n)
   - **Desvío medio** (DM = Σ|xi − x̄| / n)
   - **Desvío estándar** (σ = √σ²)
6. **Gráfico de barras** de las frecuencias: podés armarlo con CSS puro (barras con `div`), con SVG, o con una librería como Recharts. La altura de cada barra debe ser proporcional a su frecuencia.

### 3. Cálculos en `lib/stats.ts`

Toda la lógica de cálculo debe estar separada en funciones reutilizables y **tipadas**:

- `media(valores): number`
- `mediana(valores): number`
- `moda(valores): number[]`
- `varianza(valores): number`
- `desvioMedio(valores): number`
- `desvioEstandar(valores): number`
- `tablaFrecuencias(valores): { valor, frecuencia, acumulada, relativa, porcentual }[]`

Pensá en los casos borde: lista vacía, n par/impar para la mediana, moda bimodal.

### 4. Diseño y calidad

- **HTML semántico**: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<table>` para las tablas.
- Componentes reutilizables separados en `components/` (Navbar, Footer, DatasetCard, FrequencyTable, StatsCard, BarChart).
- Responsive: que se vea bien en celular y en escritorio.
- El valor numérico de cada medida debe mostrar la unidad del dataset (años, puntos, cm...).
- **Sin comentarios de más en el código** y formateado con Prettier.

## Verificá que funcione

- La home lista los 6 datasets leyendo `indice.json`.
- Entrando a cada dataset se ven los datos, la tabla de frecuencias y las 6 medidas.
- Los valores calculados coinciden con hacer la cuenta a mano (probá con `edades-alumnos`: media 16,4 y moda 16).
- Una URL inválida (`/dataset/xyz`) muestra el "no encontrado".
- El gráfico de barras refleja las frecuencias de la tabla.

## Qué se espera

- Que la app funcione de punta a punta consumiendo los JSON con `fetch`.
- Que las funciones de `lib/stats.ts` sean correctas, tipadas y reutilizables (son el corazón del TP).
- Que el diseño sea propio, prolijo y responsive, con HTML semántico.
- Que se note que entendés qué significa cada medida (podés agregar una línea de texto explicando cada una en la página de detalle).

## Tecnologías

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- Datasets estáticos en `public/data/` consumidos con `fetch()`
- Gráfico: CSS/SVG puro o Recharts (optativo)