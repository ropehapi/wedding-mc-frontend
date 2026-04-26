import { publicClient } from './client'
import type { LoginResponse, RegisterResponse } from '@/types/api'

export function register(name: string, email: string, password: string) {
  return publicClient.post<RegisterResponse>('/v1/auth/register', { name, email, password })
}

export function login(email: string, password: string) {
  return publicClient.post<LoginResponse>('/v1/auth/login', { email, password })
}

export function logout(accessToken: string) {
  return publicClient.post('/v1/auth/logout', {}, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export function refresh(refreshToken: string) {
  return publicClient.post<LoginResponse>('/v1/auth/refresh', { refresh_token: refreshToken })
}
