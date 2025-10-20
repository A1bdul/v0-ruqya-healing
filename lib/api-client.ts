// Determine if we're on server or client side
const isServer = typeof window === 'undefined';

// Use different URLs for server-side vs client-side
const API_URL = isServer 
  ? (process.env.API_URL || 'http://ruqya_backend:8000')  // Server-side: Docker network
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');  // Client-side: Public IP

// Log for debugging
if (process.env.NODE_ENV !== 'production') {
  console.log('[API Client] Configuration:', {
    isServer,
    API_URL,
  });
}

export interface ApiError {
  detail: string
  error?: string
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiClientError"
  }
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = false, ...fetchOptions } = options

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  }

  if (requiresAuth && isBrowser()) {
    const token = localStorage.getItem("access_token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  try {
    const response = await fetch(`${API_URL}/api/v1${endpoint}`, {
      ...fetchOptions,
      headers,
      cache: fetchOptions.cache || "no-store",
    })

    if (response.status === 401 && requiresAuth && isBrowser()) {
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        const token = localStorage.getItem("access_token")
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }
        const retryResponse = await fetch(`${API_URL}/api/v1${endpoint}`, {
          ...fetchOptions,
          headers,
        })

        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}))
          throw new ApiClientError(errorData.detail || "Request failed", retryResponse.status, errorData)
        }

        return retryResponse.json()
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiClientError(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData,
      )
    }

    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Network error"
    console.error(`API request failed for ${endpoint}:`, message)
    throw new ApiClientError(message, 0)
  }
}

async function refreshAccessToken(): Promise<boolean> {
  if (!isBrowser()) {
    return false
  }

  const refreshToken = localStorage.getItem("refresh_token")
  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      return false
    }

    const data = await response.json()
    localStorage.setItem("access_token", data.access_token)
    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token)
    }
    return true
  } catch (error) {
    console.error("Token refresh failed:", error)
    return false
  }
}

export const apiClient = {
  get<T>(endpoint: string, requiresAuth = false) {
    return apiRequest<T>(endpoint, { method: "GET", requiresAuth })
  },

  post<T>(endpoint: string, data?: any, requiresAuth = false) {
    return apiRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    })
  },

  put<T>(endpoint: string, data?: any, requiresAuth = false) {
    return apiRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    })
  },

  patch<T>(endpoint: string, data?: any, requiresAuth = false) {
    return apiRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    })
  },

  delete<T>(endpoint: string, requiresAuth = false) {
    return apiRequest<T>(endpoint, { method: "DELETE", requiresAuth })
  },

  async upload<T>(endpoint: string, file: File, requiresAuth = true): Promise<T> {
    const formData = new FormData()
    formData.append("file", file)

    const headers: HeadersInit = {}
    if (requiresAuth && isBrowser()) {
      const token = localStorage.getItem("access_token")
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${API_URL}/api/v1${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiClientError(errorData.detail || "Upload failed", response.status, errorData)
    }

    return response.json()
  },
}

export function isAuthenticated(): boolean {
  return isBrowser() && !!localStorage.getItem("access_token")
}

export function clearAuthTokens(): void {
  if (isBrowser()) {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  }
}
