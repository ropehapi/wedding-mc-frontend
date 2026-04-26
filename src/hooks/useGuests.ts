import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getGuests,
  getGuestsSummary,
  createGuest,
  updateGuest,
  deleteGuest,
} from '@/api/guests'
import type { GuestStatus } from '@/types/api'

const GUESTS_KEY = ['guests']
const SUMMARY_KEY = ['guests', 'summary']

export function useGuests(status?: GuestStatus) {
  return useQuery({
    queryKey: status ? [...GUESTS_KEY, status] : GUESTS_KEY,
    queryFn: () => getGuests(status).then((r) => r.data),
  })
}

export function useGuestsSummary() {
  return useQuery({
    queryKey: SUMMARY_KEY,
    queryFn: () => getGuestsSummary().then((r) => r.data),
  })
}

export function useCreateGuest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createGuest(name).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GUESTS_KEY })
    },
  })
}

export function useUpdateGuest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateGuest(id, name).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GUESTS_KEY })
    },
  })
}

export function useDeleteGuest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteGuest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GUESTS_KEY })
    },
  })
}
