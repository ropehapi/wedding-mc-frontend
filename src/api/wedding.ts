import { client } from './client'
import type { Wedding } from '@/types/api'

export interface CreateWeddingData {
  bride_name: string
  groom_name: string
  date: string
  time?: string
  location: string
  city?: string
  state?: string
  description?: string
  links?: { label: string; url: string }[]
}

export type UpdateWeddingData = Partial<CreateWeddingData>

export function getWedding() {
  return client.get<Wedding>('/v1/wedding')
}

export function createWedding(data: CreateWeddingData) {
  return client.post<Wedding>('/v1/wedding', data)
}

export function updateWedding(data: UpdateWeddingData) {
  return client.patch<Wedding>('/v1/wedding', data)
}

export function uploadPhoto(file: File) {
  const form = new FormData()
  form.append('photo', file)
  return client.post<{ id: string; url: string; order: number }>('/v1/wedding/photos', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function deletePhoto(photoID: string) {
  return client.delete(`/v1/wedding/photos/${photoID}`)
}
