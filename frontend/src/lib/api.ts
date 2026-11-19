import { API_BASE_URL } from '@/lib/constants';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
        throw new Error('Session expired');
      }
      throw new Error('RETRY');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) return {} as T;

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      return true;
    } catch {
      return false;
    }
  }

  async get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    try {
      const response = await fetch(url.toString(), { headers: this.getHeaders() });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'RETRY') {
        const response = await fetch(url.toString(), { headers: this.getHeaders() });
        return this.handleResponse<T>(response);
      }
      throw error;
    }
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'RETRY') {
        const response = await fetch(`${this.baseUrl}${path}`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: body ? JSON.stringify(body) : undefined,
        });
        return this.handleResponse<T>(response);
      }
      throw error;
    }
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'RETRY') {
        const response = await fetch(`${this.baseUrl}${path}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: body ? JSON.stringify(body) : undefined,
        });
        return this.handleResponse<T>(response);
      }
      throw error;
    }
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'RETRY') {
        const response = await fetch(`${this.baseUrl}${path}`, {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: body ? JSON.stringify(body) : undefined,
        });
        return this.handleResponse<T>(response);
      }
      throw error;
    }
  }

  async delete<T>(path: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'RETRY') {
        const response = await fetch(`${this.baseUrl}${path}`, {
          method: 'DELETE',
          headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
      }
      throw error;
    }
  }

  async upload<T>(path: string, formData: FormData): Promise<T> {
    const headers: HeadersInit = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient(API_BASE_URL);
