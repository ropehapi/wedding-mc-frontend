import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  assignGuest,
  unassignGuest,
} from '@/api/tables'

const TABLES_KEY = ['tables']

export function useTables() {
  return useQuery({
    queryKey: TABLES_KEY,
    queryFn: () => getTables().then((r) => r.data),
  })
}

export function useCreateTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ name, capacity }: { name: string; capacity: number }) =>
      createTable(name, capacity).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TABLES_KEY }),
  })
}

export function useUpdateTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name?: string; capacity?: number }) =>
      updateTable(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TABLES_KEY }),
  })
}

export function useDeleteTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTable(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TABLES_KEY }),
  })
}

export function useAssignGuest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ tableId, guestId }: { tableId: string; guestId: string }) =>
      assignGuest(tableId, guestId),
    onSuccess: () => qc.invalidateQueries({ queryKey: TABLES_KEY }),
  })
}

export function useUnassignGuest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ tableId, guestId }: { tableId: string; guestId: string }) =>
      unassignGuest(tableId, guestId),
    onSuccess: () => qc.invalidateQueries({ queryKey: TABLES_KEY }),
  })
}
