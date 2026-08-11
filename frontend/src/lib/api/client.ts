import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/lib/stores/authStore'

const BASE = (import.meta as { env: { VITE_API_URL?: string } }).env.VITE_API_URL ?? '/api'

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,  // refresh token en cookie httpOnly
  headers: { 'Content-Type': 'application/json' },
})

// Adjunta el access token a cada petición
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401 → intenta refresh → reintenta una vez
let refreshing = false
let queue: Array<() => void> = []

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      if (refreshing) {
        // Encola la petición hasta que termine el refresh
        return new Promise((resolve) => {
          queue.push(() => resolve(api(original)))
        })
      }

      refreshing = true
      try {
        const res = await axios.post<{ access_token: string }>(
          `${BASE}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const newToken = res.data.access_token
        useAuthStore.getState().setAccessToken(newToken)
        queue.forEach((fn) => fn())
        queue = []
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        refreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api
