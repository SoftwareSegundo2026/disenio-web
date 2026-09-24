/*
  Configuración global de la aplicación.
  apiBase: URL base de la API de productos (DummyJSON).
  rowsPerPage: cantidad de productos por página.
  appName: nombre de la tienda que se muestra en la interfaz.
  Los valores se sobreescriben con variables de entorno.
*/
export const config = {
  apiBase: process.env.NEXT_PUBLIC_API_BASE || "https://dummyjson.com",
  rowsPerPage: parseInt(process.env.NEXT_PUBLIC_ROWS_PER_PAGE || "8", 10),
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Mi Tienda",
};
