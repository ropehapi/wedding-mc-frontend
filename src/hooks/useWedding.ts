import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getWedding,
  createWedding,
  updateWedding,
  uploadPhoto,
  deletePhoto,
  type CreateWeddingData,
  type UpdateWeddingData,
} from '@/api/wedding'

const WEDDING_KEY = ['wedding']

export function useWedding() {
  return useQuery({
    queryKey: WEDDING_KEY,
    queryFn: () => getWedding().then((r) => r.data),
    retry: (count, error: { response?: { status?: number } }) =>
      error?.response?.status === 404 ? false : count < 2,
  })
}

export function useCreateWedding() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateWeddingData) => createWedding(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: WEDDING_KEY }),
  })
}

export function useUpdateWedding() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateWeddingData) => updateWedding(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: WEDDING_KEY }),
  })
}

export function useUploadPhoto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadPhoto(file).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: WEDDING_KEY }),
  })
}

export function useDeletePhoto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (photoID: string) => deletePhoto(photoID),
    onSuccess: () => qc.invalidateQueries({ queryKey: WEDDING_KEY }),
  })
}
