import { client } from './client'
import type { Gift, GiftStatus, GiftsSummary } from '@/types/api'

export interface CreateGiftData {
  name: string
  description?: string
  price: number
  image_url?: string
  store_url?: string
}

export type UpdateGiftData = Partial<CreateGiftData>

export function getGifts(status?: GiftStatus) {
  return client.get<Gift[]>('/v1/gifts', { params: status ? { status } : undefined })
}

export function getGiftsSummary() {
  return client.get<GiftsSummary>('/v1/gifts/summary')
}

export function createGift(data: CreateGiftData) {
  return client.post<Gift>('/v1/gifts', data)
}

export function updateGift(id: string, data: UpdateGiftData) {
  return client.patch<Gift>(`/v1/gifts/${id}`, data)
}

export function deleteGift(id: string) {
  return client.delete(`/v1/gifts/${id}`)
}

export function cancelReservation(id: string) {
  return client.delete(`/v1/gifts/${id}/reserve`)
}
