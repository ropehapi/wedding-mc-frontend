import { useWedding } from './useWedding'
import { useGuestsSummary } from './useGuests'
import { useGiftsSummary } from './useGifts'

export function useDashboard() {
  const wedding = useWedding()
  const guests = useGuestsSummary()
  const gifts = useGiftsSummary()

  return {
    wedding: wedding.data,
    guestsSummary: guests.data,
    giftsSummary: gifts.data,
    isLoading: wedding.isLoading || guests.isLoading || gifts.isLoading,
    error: wedding.error || guests.error || gifts.error,
  }
}
