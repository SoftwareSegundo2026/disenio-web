import { config } from './config';
import { useAuth } from '@/store/auth';

const API_BASE = config.apiBase;
const API_ROOT = config.apiRoot;

async function getToken(): Promise<string | null> {
  return useAuth.getState().token;
}

async function request<T>(path: string, options: RequestInit = {}, auth = false): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const isMutation = method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE';
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (isMutation || auth) {
    headers['Content-Type'] = 'application/json';
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401 && (await getToken())) {
    useAuth.getState().logout();
    throw new Error('Session expired');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null as T;
  return res.json();
}

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

export function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_ROOT}${imagePath}`;
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

export async function fetchCurrentUser(): Promise<ApiUser> {
  return request<ApiUser>('/users/me', {}, true);
}

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
}

export async function loginApi(credentials: UserLogin): Promise<string> {
  const res = await request<TokenResponse>('/auth/token', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  await useAuth.getState().setToken(res.access_token);
  await storeCurrentUser().catch(() => {});
  return res.access_token;
}

export async function storeCurrentUser(): Promise<void> {
  try {
    const user = await fetchCurrentUser();
    useAuth.getState().setUser(user);
    return;
  } catch {
    // fallback
  }

  const token = useAuth.getState().token;
  if (!token) return;
  let username = '';
  try {
    username = JSON.parse(atob(token.split('.')[1])).sub ?? '';
  } catch {
    return;
  }
  if (!username) return;

  try {
    const res = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const users: ApiUser[] = await res.json().catch(() => []);
    const me = users.find((u) => u.username === username);
    if (!me) return;
    useAuth.getState().setUser(me);
  } catch {
    // non-admin user without /users/me
  }
}

export function logout(): void {
  useAuth.getState().logout();
}

export type Collection = 'artists' | 'albums' | 'genres' | 'tracks' | 'users';

function collectionPath(col: Collection): string {
  const map: Record<Collection, string> = {
    artists: '/artists/',
    albums: '/albums/',
    genres: '/genres/',
    tracks: '/tracks',
    users: '/users',
  };
  return map[col];
}

function itemPath(col: Collection, id: number): string {
  const base = collectionPath(col);
  return base.endsWith('/') ? `${base}${id}` : `${base}/${id}`;
}

export async function getAll<T = unknown>(col: Collection, skip = 0, limit = 9999): Promise<T[]> {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  const path = `${collectionPath(col)}?${params}`;
  return request<T[]>(path);
}

export async function getAllProtected<T = unknown>(col: Collection, skip = 0, limit = 9999): Promise<T[]> {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  const path = `${collectionPath(col)}?${params}`;
  return request<T[]>(path, {}, true);
}

export async function getTotalCount(col: Collection): Promise<number> {
  const all = await getAll(col, 0, 9999);
  return all.length;
}

export async function getTotalCountProtected(col: Collection): Promise<number> {
  const all = await getAllProtected(col, 0, 9999);
  return all.length;
}

export async function updateMyProfile(fullName: string, email: string): Promise<ApiUser> {
  return request<ApiUser>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify({ full_name: fullName, email }),
  }, true);
}

export async function changeMyPassword(currentPassword: string, newPassword: string): Promise<void> {
  await request<void>(
    '/users/me/password',
    {
      method: 'PATCH',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    },
    true,
  );
}

export async function resetUserPassword(userId: number, newPassword: string): Promise<void> {
  await request<void>(
    `/users/${userId}/password`,
    {
      method: 'PATCH',
      body: JSON.stringify({ new_password: newPassword }),
    },
    true,
  );
}

export async function getActivities(skip = 0, limit = 10): Promise<ApiActivity[]> {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  return request<ApiActivity[]>(`/activities?${params}`);
}

export async function getById<T = unknown>(col: Collection, id: number): Promise<T> {
  return request<T>(itemPath(col, id));
}

export async function getByIdProtected<T = unknown>(col: Collection, id: number): Promise<T> {
  return request<T>(itemPath(col, id), {}, true);
}

export async function create<T = unknown>(col: Collection, data: unknown): Promise<T> {
  return request<T>(collectionPath(col), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function update<T = unknown>(col: Collection, id: number, data: unknown): Promise<T> {
  return request<T>(itemPath(col, id), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function remove(col: Collection, id: number): Promise<void> {
  await request<void>(itemPath(col, id), { method: 'DELETE' });
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  const token = await getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function uploadImage(
  col: 'artists' | 'albums',
  id: number,
  file: any,
): Promise<{ ImageUrl: string }> {
  const formData = new FormData();
  formData.append('file', file as Blob);
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_ROOT}/api/v1/${col}/${id}/image`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Image upload failed (${res.status})`);
  }
  return res.json();
}

export async function fetchImageFromUrl(
  col: 'artists' | 'albums',
  id: number,
  url: string,
): Promise<{ ImageUrl: string }> {
  return request(`/${col}/${id}/fetch-image`, {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}
