import { client } from './client'
import type { Table, TablesResponse } from '@/types/api'

export function getTables() {
  return client.get<TablesResponse>('/v1/tables')
}

export function createTable(name: string, capacity: number) {
  return client.post<Table>('/v1/tables', { name, capacity })
}

export function updateTable(id: string, data: { name?: string; capacity?: number }) {
  return client.patch<Table>(`/v1/tables/${id}`, data)
}

export function deleteTable(id: string) {
  return client.delete(`/v1/tables/${id}`)
}

export function assignGuest(tableId: string, guestId: string) {
  return client.put(`/v1/tables/${tableId}/guests/${guestId}`)
}

export function unassignGuest(tableId: string, guestId: string) {
  return client.delete(`/v1/tables/${tableId}/guests/${guestId}`)
}
