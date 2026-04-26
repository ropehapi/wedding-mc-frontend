import { publicClient } from './client'
import type { PublicWedding, Gift } from '@/types/api'

export function getPublicWedding(slug: string) {
  return publicClient.get<PublicWedding>(`/v1/public/${slug}`)
}

export function getPublicGuests(slug: string) {
  return publicClient.get<{ id: string; name: string; status: string }[]>(
    `/v1/public/${slug}/guests`,
  )
}

export function submitRsvp(slug: string, guestID: string, status: 'confirmed' | 'declined') {
  return publicClient.post(`/v1/public/${slug}/guests/${guestID}/rsvp`, { status })
}

export function getPublicGifts(slug: string) {
  return publicClient.get<Gift[]>(`/v1/public/${slug}/gifts`)
}

export function reserveGift(slug: string, giftID: string, guestName: string) {
  return publicClient.post(`/v1/public/${slug}/gifts/${giftID}/reserve`, {
    guest_name: guestName,
  })
}
