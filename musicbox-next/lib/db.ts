import { config } from "./config";

const API_BASE = config.apiBase;
const API_ROOT = config.apiRoot;

/*
  Helpers de sesión: lectura/escritura de token JWT y datos
  del usuario autenticado en localStorage.
  El token se obtiene del backend al hacer login y se envía
  como Bearer en las peticiones que requieren autenticación.
*/

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/** Guarda o elimina el token JWT en localStorage */
export function setToken(token: string | null): void {
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }
}

/** Alias legible para obtener el token (usado en páginas que verifican auth) */
export function getTokenValue(): string | null {
  return getToken();
}

/** Recupera el user_id del usuario logueado desde localStorage */
export function getStoredUserId(): number | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem("user_id");
  return v ? parseInt(v, 10) : null;
}

/** Recupera el nombre completo del usuario logueado desde localStorage */
export function getStoredFullName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("full_name");
}

/** Verifica si el usuario actual tiene rol de administrador */
export function getIsAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("is_admin") === "true";
}

/** Cierra sesión: elimina token y datos de usuario de localStorage */
export function logout(): void {
  setToken(null);
  if (typeof window !== "undefined") {
    localStorage.removeItem("is_admin");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("full_name");
    localStorage.removeItem("email");
  }
}

/*
  Helpers internos (no exportados). Solo los usa db.ts.
  checkUnauthorized: si el backend responde 401 y hay token,
  la sesión expiró → se hace auto-logout y se notifica al UI.
  getAuthHeaders: arma el header Authorization + Content-Type.
  getAuthHeadersWithoutContentType: igual pero sin Content-Type
  (necesario para subir archivos con FormData).
*/

async function checkUnauthorized(response: Response): Promise<void> {
  if (response.status === 401 && getToken()) {
    logout();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:expired"));
    }
    throw new Error("Session expired");
  }
}

/** Arma headers con Content-Type: application/json y token Bearer si existe */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/** Arma headers solo con token Bearer (sin Content-Type, para FormData/multipart) */
async function getAuthHeadersWithoutContentType(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/*
  Interfaces de datos. Cada una refleja la forma en que el
  backend devuelve los recursos (artistas, álbumes, géneros,
  canciones, usuarios, actividades). Se usan como tipo de
  retorno de las funciones fetch y en los estados de React.
*/

export interface UserLogin {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ApiArtist {
  ArtistId: number;
  Name: string;
  ImageUrl?: string | null;
}

export interface ApiAlbum {
  AlbumId: number;
  Title: string;
  ArtistId: number;
  ArtistName: string | null;
  ImageUrl?: string | null;
}

export interface ApiGenre {
  GenreId: number;
  Name: string;
}

export interface ApiTrack {
  TrackId: number;
  Name: string;
  AlbumId: number | null;
  MediaTypeId: number;
  GenreId: number | null;
  Composer: string | null;
  Milliseconds: number;
  Bytes: number | null;
  UnitPrice: number;
  AlbumTitle: string | null;
  GenreName: string | null;
  MediaTypeName: string | null;
}

export interface ApiUser {
  user_id: number | null;
  username: string;
  email: string | null;
  full_name: string | null;
  disabled: boolean;
  is_admin: boolean;
}

export interface ApiActivity {
  activity_id: number;
  timestamp: string;
  username: string;
  action_type: string;
  detail: string | null;
}

/*
  getImageUrl: toma la ruta relativa que devuelve el backend
  y la completa con API_ROOT para obtener una URL absoluta.
  Si ya es URL absoluta (http), la devuelve tal cual.
*/

export function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_ROOT}${imagePath}`;
}

/*
  Autenticación. loginApi envía usuario+contraseña al backend,
  guarda el token JWT recibido y carga los datos del usuario
  en localStorage para que estén disponibles en toda la app.
*/

export async function loginApi(credentials: UserLogin): Promise<string> {
  const response = await fetch(`${API_BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Login failed (${response.status})`);
  }

  const data: TokenResponse = await response.json();
  setToken(data.access_token);
  await Promise.race([storeCurrentUser(), timeout(15000)]).catch(() => {});
  return data.access_token;
}

/** Obtiene los datos del usuario autenticado desde /users/me */
export async function fetchCurrentUser(): Promise<ApiUser> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/users/me`, { headers });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to fetch user (${response.status})`);
  }

  return response.json();
}

/*
  Guarda en localStorage los datos del usuario logueado.
  Primero intenta /users/me; si falla (ej: admin sin endpoint),
  busca en la lista de usuarios por el sub del JWT.
*/
export async function storeCurrentUser(): Promise<void> {
  try {
    const user = await fetchCurrentUser();
    localStorage.setItem("is_admin", user.is_admin ? "true" : "false");
    localStorage.setItem("user_id", String(user.user_id ?? ""));
    localStorage.setItem("username", user.username || "");
    localStorage.setItem("full_name", user.full_name || "");
    localStorage.setItem("email", user.email || "");
    return;
  } catch {
    // fallback
  }

  const token = getToken();
  if (!token) return;
  let username = "";
  try {
    username = JSON.parse(atob(token.split(".")[1])).sub ?? "";
  } catch {
    return;
  }
  if (!username) return;

  try {
    const response = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return;
    const users: ApiUser[] = await response.json().catch(() => []);
    const me = users.find((u) => u.username === username);
    if (!me) return;
    localStorage.setItem("is_admin", me.is_admin ? "true" : "false");
    localStorage.setItem("user_id", String(me.user_id ?? ""));
    localStorage.setItem("username", me.username || "");
    localStorage.setItem("full_name", me.full_name || "");
    localStorage.setItem("email", me.email || "");
  } catch {
    // non-admin user without /users/me — defaults remain empty
  }
}

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

/*
  CRUD de artistas. Cada función es un fetch explícito al backend:
  GET para listar/obtener, POST para crear, PATCH para actualizar,
  DELETE para eliminar. Las mutaciones (POST/PATCH/DELETE) envían
  el token JWT en el header Authorization.
  skip/limit controlan la paginación.
*/

export async function getAllArtists(skip = 0, limit = 9999): Promise<ApiArtist[]> {
  const response = await fetch(`${API_BASE}/artists/?skip=${skip}&limit=${limit}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to fetch artists (${response.status})`);
  }

  return response.json();
}

/** Obtiene un artista por su ID */
export async function getArtistById(id: number): Promise<ApiArtist> {
  const response = await fetch(`${API_BASE}/artists/${id}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to fetch artist (${response.status})`);
  }

  return response.json();
}

/** Crea un nuevo artista (requiere autenticación) */
export async function createArtist(data: { Name: string }): Promise<ApiArtist> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/artists/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to create artist (${response.status})`);
  }

  return response.json();
}

/** Actualiza un artista existente (requiere autenticación) */
export async function updateArtist(id: number, data: { Name: string }): Promise<ApiArtist> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/artists/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to update artist (${response.status})`);
  }

  return response.json();
}

/** Elimina un artista por su ID (requiere autenticación) */
export async function deleteArtist(id: number): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/artists/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to delete artist (${response.status})`);
  }
}

/** Obtiene el total de artistas consultando todos y contando */
export async function getArtistCount(): Promise<number> {
  const artists = await getAllArtists(0, 9999);
  return artists.length;
}

/*
  CRUD de álbumes. Misma estructura que artistas.
  GET para listar/obtener, POST/PATCH/DELETE con autenticación.
*/

export async function getAllAlbums(skip = 0, limit = 9999): Promise<ApiAlbum[]> {
  const response = await fetch(`${API_BASE}/albums/?skip=${skip}&limit=${limit}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to fetch albums (${response.status})`);
  }

  return response.json();
}

/** Obtiene un álbum por su ID */
export async function getAlbumById(id: number): Promise<ApiAlbum> {
  const response = await fetch(`${API_BASE}/albums/${id}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to fetch album (${response.status})`);
  }

  return response.json();
}

/** Crea un nuevo álbum (requiere autenticación) */
export async function createAlbum(data: { Title: string; ArtistId?: number }): Promise<ApiAlbum> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/albums/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to create album (${response.status})`);
  }

  return response.json();
}

/** Actualiza un álbum existente (requiere autenticación) */
export async function updateAlbum(id: number, data: { Title: string; ArtistId?: number }): Promise<ApiAlbum> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/albums/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to update album (${response.status})`);
  }

  return response.json();
}

/** Elimina un álbum por su ID (requiere autenticación) */
export async function deleteAlbum(id: number): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/albums/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to delete album (${response.status})`);
  }
}

/** Obtiene el total de álbumes */
export async function getAlbumCount(): Promise<number> {
  const albums = await getAllAlbums(0, 9999);
  return albums.length;
}

/*
  CRUD de géneros musicales. Endpoint público para lecturas,
  mutaciones protegidas con token.
*/

export async function getAllGenres(skip = 0, limit = 9999): Promise<ApiGenre[]> {
  const response = await fetch(`${API_BASE}/genres/?skip=${skip}&limit=${limit}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to fetch genres (${response.status})`);
  }

  return response.json();
}

/** Obtiene un género por su ID */
export async function getGenreById(id: number): Promise<ApiGenre> {
  const response = await fetch(`${API_BASE}/genres/${id}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to fetch genre (${response.status})`);
  }

  return response.json();
}

/** Crea un nuevo género (requiere autenticación) */
export async function createGenre(data: { Name: string }): Promise<ApiGenre> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/genres/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to create genre (${response.status})`);
  }

  return response.json();
}

/** Actualiza un género existente (requiere autenticación) */
export async function updateGenre(id: number, data: { Name: string }): Promise<ApiGenre> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/genres/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to update genre (${response.status})`);
  }

  return response.json();
}

/** Elimina un género por su ID (requiere autenticación) */
export async function deleteGenre(id: number): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/genres/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to delete genre (${response.status})`);
  }
}

/** Obtiene el total de géneros */
export async function getGenreCount(): Promise<number> {
  const genres = await getAllGenres(0, 9999);
  return genres.length;
}

/*
  CRUD de canciones (tracks). Endpoint público para lecturas,
  mutaciones protegidas con token.
  Nota: tracks usa /tracks (sin slash final) en la URL.
*/

export async function getAllTracks(skip = 0, limit = 9999): Promise<ApiTrack[]> {
  const response = await fetch(`${API_BASE}/tracks?skip=${skip}&limit=${limit}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to fetch tracks (${response.status})`);
  }

  return response.json();
}

/** Obtiene una canción por su ID */
export async function getTrackById(id: number): Promise<ApiTrack> {
  const response = await fetch(`${API_BASE}/tracks/${id}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to fetch track (${response.status})`);
  }

  return response.json();
}

/** Crea una nueva canción (requiere autenticación) */
export async function createTrack(data: Record<string, unknown>): Promise<ApiTrack> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/tracks`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to create track (${response.status})`);
  }

  return response.json();
}

/** Actualiza una canción existente (requiere autenticación) */
export async function updateTrack(id: number, data: Record<string, unknown>): Promise<ApiTrack> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/tracks/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to update track (${response.status})`);
  }

  return response.json();
}

/** Elimina una canción por su ID (requiere autenticación) */
export async function deleteTrack(id: number): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/tracks/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to delete track (${response.status})`);
  }
}

/** Obtiene el total de canciones */
export async function getTrackCount(): Promise<number> {
  const tracks = await getAllTracks(0, 9999);
  return tracks.length;
}

/*
  CRUD de usuarios. Todas las funciones requieren autenticación
  (token JWT), a diferencia de artistas/álbumes/etc. que son
  públicos en lectura. Los usuarios solo los ve el admin.
*/

export async function getAllUsers(skip = 0, limit = 9999): Promise<ApiUser[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/users?skip=${skip}&limit=${limit}`, { headers });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to fetch users (${response.status})`);
  }

  return response.json();
}

/** Crea un nuevo usuario (requiere autenticación) */
export async function createUser(data: Record<string, unknown>): Promise<ApiUser> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to create user (${response.status})`);
  }

  return response.json();
}

/** Actualiza un usuario existente (requiere autenticación) */
export async function updateUser(id: number, data: Record<string, unknown>): Promise<ApiUser> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to update user (${response.status})`);
  }

  return response.json();
}

/** Elimina un usuario por su ID (requiere autenticación) */
export async function deleteUser(id: number): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to delete user (${response.status})`);
  }
}

/** Obtiene el total de usuarios (requiere autenticación) */
export async function getUserCount(): Promise<number> {
  const users = await getAllUsers(0, 9999);
  return users.length;
}

/*
  Subida de imágenes. Usa FormData (multipart) en lugar de JSON,
  por eso no envía Content-Type (lo pone fetch automáticamente).
  El archivo se asocia al recurso (artista o álbum) por su ID.
*/

export async function uploadArtistImage(id: number, file: File): Promise<{ ImageUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const authHeaders = await getAuthHeadersWithoutContentType();
  const response = await fetch(`${API_ROOT}/api/v1/artists/${id}/image`, {
    method: "POST",
    headers: authHeaders,
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Image upload failed (${response.status})`);
  }

  return response.json();
}

/** Sube una imagen para un álbum (multipart, requiere autenticación) */
export async function uploadAlbumImage(id: number, file: File): Promise<{ ImageUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const authHeaders = await getAuthHeadersWithoutContentType();
  const response = await fetch(`${API_ROOT}/api/v1/albums/${id}/image`, {
    method: "POST",
    headers: authHeaders,
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Image upload failed (${response.status})`);
  }

  return response.json();
}

/** Descarga una imagen desde una URL externa y la asigna a un artista */
export async function fetchArtistImageFromUrl(id: number, url: string): Promise<{ ImageUrl: string }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/artists/${id}/fetch-image`, {
    method: "POST",
    headers,
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to fetch image (${response.status})`);
  }

  return response.json();
}

/** Descarga una imagen desde una URL externa y la asigna a un álbum */
export async function fetchAlbumImageFromUrl(id: number, url: string): Promise<{ ImageUrl: string }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/albums/${id}/fetch-image`, {
    method: "POST",
    headers,
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to fetch image (${response.status})`);
  }

  return response.json();
}

/*
  Cambio y reseteo de contraseñas.
  changeMyPassword: el usuario cambia su propia contraseña (requiere actual).
  resetUserPassword: un admin resetea la contraseña de otro usuario.
*/

export async function changeMyPassword(currentPassword: string, newPassword: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/users/me/password`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to change password (${response.status})`);
  }
}

/** Resetea la contraseña de un usuario (solo admin, requiere autenticación) */
export async function resetUserPassword(userId: number, newPassword: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/users/${userId}/password`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ new_password: newPassword }),
  });

  if (!response.ok) {
    await checkUnauthorized(response);
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to reset password (${response.status})`);
  }
}

/*
  Actividades (log de auditoría). Endpoint público de lectura.
  Devuelve un historial de acciones (login, create, update, delete)
  ordenado por fecha, útil para el dashboard.
*/

export async function getActivities(skip = 0, limit = 10): Promise<ApiActivity[]> {
  const response = await fetch(`${API_BASE}/activities?skip=${skip}&limit=${limit}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Failed to fetch activities (${response.status})`);
  }

  return response.json();
}
