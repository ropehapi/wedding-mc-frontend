import { client } from './client'
import type { Guest, GuestStatus, GuestsSummary } from '@/types/api'

export function getGuests(status?: GuestStatus) {
  return client.get<Guest[]>('/v1/guests', { params: status ? { status } : undefined })
}

export function getGuestsSummary() {
  return client.get<GuestsSummary>('/v1/guests/summary')
}

export function createGuest(name: string) {
  return client.post<Guest>('/v1/guests', { name })
}

export function updateGuest(id: string, name: string) {
  return client.patch<Guest>(`/v1/guests/${id}`, { name })
}

export function deleteGuest(id: string) {
  return client.delete(`/v1/guests/${id}`)
}
