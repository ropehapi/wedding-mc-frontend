import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useGifts, useGiftsSummary, useCreateGift, useUpdateGift, useDeleteGift, useCancelReservation } from '@/hooks/useGifts'
import type { Gift, GiftStatus } from '@/types/api'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

const STATUS_FILTERS: { label: string; value: GiftStatus | undefined }[] = [
  { label: 'Todos', value: undefined },
  { label: 'Disponível', value: 'available' },
  { label: 'Reservado', value: 'reserved' },
]

const giftSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  image_url: z.string().url('URL inválida').optional().or(z.literal('')),
  store_url: z.string().url('URL inválida').optional().or(z.literal('')),
})

type GiftFormData = z.infer<typeof giftSchema>

export default function GiftsPage() {
  const [filter, setFilter] = useState<GiftStatus | undefined>(undefined)
  const { data: gifts, isLoading } = useGifts(filter)
  const { data: summary } = useGiftsSummary()
  const createGift = useCreateGift()
  const updateGift = useUpdateGift()
  const deleteGift = useDeleteGift()
  const cancelReservation = useCancelReservation()

  const [addOpen, setAddOpen] = useState(false)
  const [editGift, setEditGift] = useState<Gift | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [cancelId, setCancelId] = useState<string | null>(null)

  const addForm = useForm<GiftFormData>({ resolver: zodResolver(giftSchema) })
  const editForm = useForm<GiftFormData>({ resolver: zodResolver(giftSchema) })

  async function handleAdd(data: GiftFormData) {
    try {
      await createGift.mutateAsync({
        ...data,
        image_url: data.image_url || undefined,
        store_url: data.store_url || undefined,
        description: data.description || undefined,
      })
      toast.success('Presente adicionado!')
      addForm.reset()
      setAddOpen(false)
    } catch {
      toast.error('Erro ao adicionar presente.')
    }
  }

  function openEdit(gift: Gift) {
    setEditGift(gift)
    editForm.reset({
      name: gift.name,
      description: gift.description ?? '',
      price: gift.price,
      image_url: gift.image_url ?? '',
      store_url: gift.store_url ?? '',
    })
  }

  async function handleEdit(data: GiftFormData) {
    if (!editGift) return
    try {
      await updateGift.mutateAsync({
        id: editGift.id,
        data: {
          ...data,
          image_url: data.image_url || undefined,
          store_url: data.store_url || undefined,
          description: data.description || undefined,
        },
      })
      toast.success('Presente atualizado!')
      setEditGift(null)
    } catch {
      toast.error('Erro ao atualizar presente.')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteGift.mutateAsync(deleteId)
      toast.success('Presente removido.')
    } catch {
      toast.error('Erro ao remover presente.')
    } finally {
      setDeleteId(null)
    }
  }

  async function handleCancelReservation() {
    if (!cancelId) return
    try {
      await cancelReservation.mutateAsync(cancelId)
      toast.success('Reserva cancelada.')
    } catch {
      toast.error('Erro ao cancelar reserva.')
    } finally {
      setCancelId(null)
    }
  }

  const deletingGift = gifts?.find((g) => g.id === deleteId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl font-semibold text-admin-text">Presentes</h1>
          <p className="mt-1 text-sm text-admin-muted">Gerencie a lista de presentes</p>
        </div>
        <Button
          className="bg-admin-accent hover:bg-admin-accent-hover"
          onClick={() => setAddOpen(true)}
        >
          + Adicionar
        </Button>
      </div>

      {/* Resumo */}
      {summary && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: summary.total, color: 'text-admin-text' },
            { label: 'Disponíveis', value: summary.available, color: 'text-green-600' },
            { label: 'Reservados', value: summary.reserved, color: 'text-blue-600' },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-admin-border bg-white p-4">
              <p className="text-xs text-admin-muted">{card.label}</p>
              <p className={`mt-1 text-2xl font-semibold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={String(f.value)}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-admin-accent text-white'
                : 'bg-admin-surface text-admin-muted hover:text-admin-text'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-admin-border bg-white overflow-hidden">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !gifts || gifts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-admin-muted">Nenhum presente encontrado.</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-admin-accent"
              onClick={() => setAddOpen(true)}
            >
              Adicionar primeiro presente
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border bg-admin-surface text-left">
                <th className="px-4 py-3 font-medium text-admin-muted">Presente</th>
                <th className="hidden px-4 py-3 font-medium text-admin-muted sm:table-cell">Preço</th>
                <th className="px-4 py-3 font-medium text-admin-muted">Status</th>
                <th className="hidden px-4 py-3 font-medium text-admin-muted md:table-cell">Reservado por</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {gifts.map((gift) => (
                <tr key={gift.id} className="hover:bg-admin-surface/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {gift.image_url ? (
                        <img
                          src={gift.image_url}
                          alt={gift.name}
                          className="h-10 w-10 rounded-md object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 flex-shrink-0 rounded-md bg-admin-surface" />
                      )}
                      <span className="font-medium text-admin-text">{gift.name}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-admin-muted sm:table-cell">
                    {formatCurrency(gift.price)}
                  </td>
                  <td className="px-4 py-3">
                    {gift.status === 'available' ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Disponível
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        Reservado
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-admin-muted md:table-cell">
                    {gift.reserved_by ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {gift.status === 'reserved' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-admin-muted hover:text-yellow-600"
                          onClick={() => setCancelId(gift.id)}
                        >
                          Cancelar reserva
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-admin-muted hover:text-admin-text"
                        onClick={() => openEdit(gift)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-admin-muted hover:text-destructive"
                        onClick={() => setDeleteId(gift.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal — Adicionar */}
      <GiftFormDialog
        open={addOpen}
        title="Adicionar presente"
        form={addForm}
        onSubmit={handleAdd}
        onClose={() => { setAddOpen(false); addForm.reset() }}
        isPending={createGift.isPending}
        submitLabel="Adicionar"
      />

      {/* Modal — Editar */}
      <GiftFormDialog
        open={!!editGift}
        title="Editar presente"
        form={editForm}
        onSubmit={handleEdit}
        onClose={() => setEditGift(null)}
        isPending={updateGift.isPending}
        submitLabel="Salvar"
      />

      {/* Confirmação — Remover */}
      <ConfirmDialog
        open={!!deleteId}
        title="Remover presente"
        description={
          deletingGift?.status === 'reserved'
            ? 'Este presente está reservado. Remover também cancela a reserva. Deseja continuar?'
            : 'O presente será removido permanentemente.'
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteGift.isPending}
      />

      {/* Confirmação — Cancelar reserva */}
      <ConfirmDialog
        open={!!cancelId}
        title="Cancelar reserva"
        description="A reserva será cancelada e o presente voltará a ficar disponível."
        onConfirm={handleCancelReservation}
        onCancel={() => setCancelId(null)}
        isLoading={cancelReservation.isPending}
        variant="default"
      />
    </div>
  )
}

interface GiftFormDialogProps {
  open: boolean
  title: string
  form: ReturnType<typeof useForm<GiftFormData>>
  onSubmit: (data: GiftFormData) => void
  onClose: () => void
  isPending: boolean
  submitLabel: string
}

function GiftFormDialog({ open, title, form, onSubmit, onClose, isPending, submitLabel }: GiftFormDialogProps) {
  const { register, handleSubmit, formState: { errors } } = form

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="g-name">Nome</Label>
            <Input id="g-name" {...register('name')} placeholder="Jogo de panelas" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="g-price">Preço (R$)</Label>
            <Input id="g-price" type="number" step="0.01" min="0" {...register('price', { valueAsNumber: true })} placeholder="350.00" />
            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="g-description">Descrição (opcional)</Label>
            <Input id="g-description" {...register('description')} placeholder="Breve descrição" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="g-image">URL da imagem (opcional)</Label>
            <Input id="g-image" {...register('image_url')} placeholder="https://..." />
            {errors.image_url && <p className="text-xs text-destructive">{errors.image_url.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="g-store">URL da loja (opcional)</Label>
            <Input id="g-store" {...register('store_url')} placeholder="https://..." />
            {errors.store_url && <p className="text-xs text-destructive">{errors.store_url.message}</p>}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-admin-accent hover:bg-admin-accent-hover"
              disabled={isPending}
            >
              {isPending ? 'Salvando…' : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
