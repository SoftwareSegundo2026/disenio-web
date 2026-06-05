export const config = {
  apiBase: process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/api/v1",
  apiRoot: process.env.NEXT_PUBLIC_API_ROOT || "http://127.0.0.1:8000",
  rowsPerPage: parseInt(process.env.NEXT_PUBLIC_ROWS_PER_PAGE || "6", 10),
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Sonance",
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "es",
};
