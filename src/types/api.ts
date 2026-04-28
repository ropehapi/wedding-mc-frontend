export interface User {
  id: string
  name: string
  email: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface LoginResponse extends AuthTokens {
  user?: User
}

export interface RegisterResponse {
  user: User
}

// Guests
export type GuestStatus = 'pending' | 'confirmed' | 'declined'

export interface Guest {
  id: string
  name: string
  status: GuestStatus
  access_code: string
  rsvp_at: string | null
}

export interface GuestsSummary {
  total: number
  confirmed: number
  pending: number
  declined: number
}

// Gifts
export type GiftStatus = 'available' | 'reserved'

export interface Gift {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  store_url: string | null
  status: GiftStatus
  reserved_by: string | null
}

export interface PublicGift {
  id: string
  name: string
  description: string | null
  price: number | null
  image_url: string | null
  store_url: string | null
  reserved: boolean
}

export interface GiftsSummary {
  total: number
  available: number
  reserved: number
}

// Wedding
export interface WeddingLink {
  label: string
  url: string
}

export interface WeddingPhoto {
  id: string
  url: string
  order: number
  is_cover: boolean
}

export interface Wedding {
  id: string
  slug: string
  bride_name: string
  groom_name: string
  date: string
  time: string
  location: string
  city: string
  state: string
  description: string | null
  links: WeddingLink[]
  photos: WeddingPhoto[]
}

// Public
export interface PublicWedding extends Wedding {
  guests: Pick<Guest, 'id' | 'name' | 'status'>[]
  gifts: Gift[]
}
