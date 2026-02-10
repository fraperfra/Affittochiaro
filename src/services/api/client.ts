import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
const API_TIMEOUT = 30000;

// Token storage keys
const ACCESS_TOKEN_KEY = 'affittochiaro_access_token';
const REFRESH_TOKEN_KEY = 'affittochiaro_refresh_token';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const newToken = getAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message = extractErrorMessage(error);
    return Promise.reject(new ApiError(message, error.response?.status || 500, error.response?.data));
  }
);

// Token management
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Token refresh (placeholder - implement with Cognito)
async function refreshAccessToken(): Promise<boolean> {
  try {
    // Dynamic import to avoid circular dependency
    const { authService } = await import('../index');

    const currentToken = getAccessToken();
    if (!currentToken) return false;

    const newToken = await authService.refreshToken(currentToken);
    if (newToken) {
      setTokens(newToken);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Error extraction
function extractErrorMessage(error: AxiosError): string {
  const data = error.response?.data as any;

  if (data?.error) return data.error;
  if (data?.message) return data.message;
  if (error.message) return error.message;

  switch (error.response?.status) {
    case 400: return 'Richiesta non valida';
    case 401: return 'Sessione scaduta. Effettua nuovamente il login.';
    case 403: return 'Accesso non autorizzato';
    case 404: return 'Risorsa non trovata';
    case 409: return 'Conflitto con dati esistenti';
    case 422: return 'Dati non validi';
    case 429: return 'Troppe richieste. Riprova tra poco.';
    case 500: return 'Errore del server. Riprova più tardi.';
    default: return 'Si è verificato un errore';
  }
}

// Custom error class
export class ApiError extends Error {
  public statusCode: number;
  public data: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Helper methods
export async function get<T>(url: string, params?: Record<string, any>): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(url, { params });
  return response.data.data as T;
}

export async function post<T>(url: string, data?: any): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(url, data);
  return response.data.data as T;
}

export async function put<T>(url: string, data?: any): Promise<T> {
  const response = await apiClient.put<ApiResponse<T>>(url, data);
  return response.data.data as T;
}

export async function patch<T>(url: string, data?: any): Promise<T> {
  const response = await apiClient.patch<ApiResponse<T>>(url, data);
  return response.data.data as T;
}

export async function del<T>(url: string): Promise<T> {
  const response = await apiClient.delete<ApiResponse<T>>(url);
  return response.data.data as T;
}

/**
 * Upload file con FormData e progress tracking
 */
export async function uploadWithProgress<T>(
  url: string,
  formData: FormData,
  onProgress?: (progress: number) => void
): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
  return response.data.data as T;
}

/**
 * Upload diretto a URL presigned (es. S3)
 * Usa XMLHttpRequest per migliore controllo del progress
 */
export function uploadToPresignedUrl(
  presignedUrl: string,
  file: File | Blob,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        onProgress(percentCompleted);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new ApiError(`Upload fallito: ${xhr.statusText}`, xhr.status));
      }
    };

    xhr.onerror = () => {
      reject(new ApiError('Errore di rete durante il caricamento', 0));
    };

    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.send(file);
  });
}

export default apiClient;
