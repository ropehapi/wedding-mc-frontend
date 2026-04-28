import { publicClient } from './client'
import type { PublicWedding, PublicGift } from '@/types/api'

export function getPublicWedding(slug: string) {
  return publicClient.get<PublicWedding>(`/v1/public/${slug}`)
}

export function getPublicGuests(slug: string) {
  return publicClient.get<{ id: string; name: string; status: string }[]>(
    `/v1/public/${slug}/guests`,
  )
}

export function validateGuestCode(slug: string, accessCode: string) {
  return publicClient.post<{ id: string; name: string; status: string }>(
    `/v1/public/${slug}/guests/validate-code`,
    { access_code: accessCode },
  )
}

export function submitRsvp(
  slug: string,
  guestID: string,
  accessCode: string,
  status: 'confirmed' | 'declined',
) {
  return publicClient.post(`/v1/public/${slug}/guests/${guestID}/rsvp`, {
    status,
    access_code: accessCode,
  })
}

export function getPublicGifts(slug: string) {
  return publicClient.get<PublicGift[]>(`/v1/public/${slug}/gifts`)
}

export function reserveGift(slug: string, giftID: string, guestId: string, accessCode: string) {
  return publicClient.post(`/v1/public/${slug}/gifts/${giftID}/reserve`, {
    guest_id: guestId,
    access_code: accessCode,
  })
}
