import axios, { type AxiosResponse } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL as string

export const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Axios instance sem auth — usada para refresh e endpoints públicos
export const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Fila de requests pendentes durante refresh
type QueueItem = {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}
let isRefreshing = false
let failedQueue: QueueItem[] = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error)
    } else {
      item.resolve(token!)
    }
  })
  failedQueue = []
}

// Response interceptor — desembrulha envelope { data: { ... } } do backend
function unwrapEnvelope(response: AxiosResponse): AxiosResponse {
  if (response.data !== null && typeof response.data === 'object' && 'data' in response.data) {
    response.data = response.data.data
  }
  return response
}

client.interceptors.response.use(unwrapEnvelope)
publicClient.interceptors.response.use(unwrapEnvelope)

// Request interceptor — injeta token quando disponível
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Response interceptor — detecta 401, tenta refresh, faz retry
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return client(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = localStorage.getItem('refresh_token')

    if (!refreshToken) {
      processQueue(error, null)
      isRefreshing = false
      clearAuthAndRedirect()
      return Promise.reject(error)
    }

    try {
      const { data } = await publicClient.post<{ access_token: string; refresh_token: string }>(
        '/v1/auth/refresh',
        { refresh_token: refreshToken },
      )
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      processQueue(null, data.access_token)
      originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`
      return client(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      clearAuthAndRedirect()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

function clearAuthAndRedirect() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  window.location.href = '/login'
}
