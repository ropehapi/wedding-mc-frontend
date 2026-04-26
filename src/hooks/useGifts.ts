import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getGifts,
  getGiftsSummary,
  createGift,
  updateGift,
  deleteGift,
  cancelReservation,
  type CreateGiftData,
  type UpdateGiftData,
} from '@/api/gifts'
import type { GiftStatus } from '@/types/api'

const GIFTS_KEY = ['gifts']
const SUMMARY_KEY = ['gifts', 'summary']

export function useGifts(status?: GiftStatus) {
  return useQuery({
    queryKey: status ? [...GIFTS_KEY, status] : GIFTS_KEY,
    queryFn: () => getGifts(status).then((r) => r.data),
  })
}

export function useGiftsSummary() {
  return useQuery({
    queryKey: SUMMARY_KEY,
    queryFn: () => getGiftsSummary().then((r) => r.data),
  })
}

export function useCreateGift() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateGiftData) => createGift(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GIFTS_KEY })
    },
  })
}

export function useUpdateGift() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGiftData }) =>
      updateGift(id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GIFTS_KEY })
    },
  })
}

export function useDeleteGift() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteGift(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GIFTS_KEY })
    },
  })
}

export function useCancelReservation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelReservation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GIFTS_KEY })
    },
  })
}
