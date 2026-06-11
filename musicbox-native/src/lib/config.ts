import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBase ?? 'http://127.0.0.1:8000/api/v1';
const API_ROOT_URL = Constants.expoConfig?.extra?.apiRoot ?? 'http://127.0.0.1:8000';

export const config = {
  apiBase: API_BASE_URL,
  apiRoot: API_ROOT_URL,
  rowsPerPage: 8,
  appName: 'Sonance',
  defaultLocale: 'es',
};
