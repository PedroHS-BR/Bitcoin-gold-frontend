export const API_URL = "http://localhost:8080";

export function setToken(token: string) {
  localStorage.setItem('jwtToken', token);
}

export function getToken(): string | null {
  return localStorage.getItem('jwtToken');
}

export function clearToken() {
  localStorage.removeItem('jwtToken');
}

export async function apiGet(path: string) {
  const token = getToken();
  return fetch(`${API_URL}${path}`, {
    method: 'GET',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
}

export async function apiPost(path: string, body: any) {
  const token = getToken();
  return fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });
} 