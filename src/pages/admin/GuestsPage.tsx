import { useState } from 'react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { useGuests, useGuestsSummary, useCreateGuest, useUpdateGuest, useDeleteGuest } from '@/hooks/useGuests'
import type { Guest, GuestStatus } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { formatDate } from '@/lib/utils'

const STATUS_FILTERS: { label: string; value: GuestStatus | undefined }[] = [
  { label: 'Todos', value: undefined },
  { label: 'Pendente', value: 'pending' },
  { label: 'Confirmado', value: 'confirmed' },
  { label: 'Recusou', value: 'declined' },
]

const STATUS_BADGE: Record<GuestStatus, { label: string; className: string }> = {
  pending: { label: 'Pendente', className: 'bg-gray-100 text-gray-600' },
  confirmed: { label: 'Confirmado', className: 'bg-green-100 text-green-700' },
  declined: { label: 'Recusou', className: 'bg-red-100 text-red-700' },
}

export default function GuestsPage() {
  const [filter, setFilter] = useState<GuestStatus | undefined>(undefined)
  const { data: guests, isLoading } = useGuests(filter)
  const { data: summary } = useGuestsSummary()
  const createGuest = useCreateGuest()
  const updateGuest = useUpdateGuest()
  const deleteGuest = useDeleteGuest()

  const [addOpen, setAddOpen] = useState(false)
  const [addName, setAddName] = useState('')
  const [editGuest, setEditGuest] = useState<Guest | null>(null)
  const [editName, setEditName] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function handleAdd() {
    if (!addName.trim()) return
    try {
      await createGuest.mutateAsync(addName.trim())
      toast.success('Convidado adicionado!')
      setAddName('')
      setAddOpen(false)
    } catch {
      toast.error('Erro ao adicionar convidado.')
    }
  }

  async function handleEdit() {
    if (!editGuest || !editName.trim()) return
    try {
      await updateGuest.mutateAsync({ id: editGuest.id, name: editName.trim() })
      toast.success('Convidado atualizado!')
      setEditGuest(null)
    } catch {
      toast.error('Erro ao atualizar convidado.')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteGuest.mutateAsync(deleteId)
      toast.success('Convidado removido.')
    } catch {
      toast.error('Erro ao remover convidado.')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl font-semibold text-admin-text">Convidados</h1>
          <p className="mt-1 text-sm text-admin-muted">Gerencie a lista de convidados</p>
        </div>
        <Button
          className="bg-admin-accent hover:bg-admin-accent-hover"
          onClick={() => setAddOpen(true)}
        >
          + Adicionar
        </Button>
      </div>

      {/* Cards de resumo */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total', value: summary.total, color: 'text-admin-text' },
            { label: 'Confirmados', value: summary.confirmed, color: 'text-green-600' },
            { label: 'Pendentes', value: summary.pending, color: 'text-yellow-600' },
            { label: 'Recusaram', value: summary.declined, color: 'text-red-600' },
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
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !guests || guests.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-admin-muted">Nenhum convidado encontrado.</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-admin-accent"
              onClick={() => setAddOpen(true)}
            >
              Adicionar primeiro convidado
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border bg-admin-surface text-left">
                <th className="px-4 py-3 font-medium text-admin-muted">Nome</th>
                <th className="px-4 py-3 font-medium text-admin-muted">Status</th>
                <th className="hidden px-4 py-3 font-medium text-admin-muted sm:table-cell">Código</th>
                <th className="hidden px-4 py-3 font-medium text-admin-muted sm:table-cell">RSVP em</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {guests.map((guest) => {
                const badge = STATUS_BADGE[guest.status]
                return (
                  <tr key={guest.id} className="hover:bg-admin-surface/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-admin-text">{guest.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      {guest.access_code ? (
                        <span className="inline-flex items-center gap-1.5">
                          <code className="rounded bg-admin-surface px-1.5 py-0.5 text-xs font-mono text-admin-text">
                            {guest.access_code}
                          </code>
                          <button
                            className="text-admin-muted hover:text-admin-text transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(guest.access_code)
                              toast.success('Código copiado!')
                            }}
                            title="Copiar código"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ) : '—'}
                    </td>
                    <td className="hidden px-4 py-3 text-admin-muted sm:table-cell">
                      {guest.rsvp_at ? formatDate(guest.rsvp_at.slice(0, 10)) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-admin-muted hover:text-admin-text"
                          onClick={() => {
                            setEditGuest(guest)
                            setEditName(guest.name)
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-admin-muted hover:text-destructive"
                          onClick={() => setDeleteId(guest.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal — Adicionar */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Adicionar convidado</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label htmlFor="add-name">Nome</Label>
            <Input
              id="add-name"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              placeholder="Nome do convidado"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setAddOpen(false); setAddName('') }}>
              Cancelar
            </Button>
            <Button
              className="bg-admin-accent hover:bg-admin-accent-hover"
              onClick={handleAdd}
              disabled={createGuest.isPending || !addName.trim()}
            >
              {createGuest.isPending ? 'Adicionando…' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal — Editar */}
      <Dialog open={!!editGuest} onOpenChange={(v) => !v && setEditGuest(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar convidado</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label htmlFor="edit-name">Nome</Label>
            <Input
              id="edit-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditGuest(null)}>
              Cancelar
            </Button>
            <Button
              className="bg-admin-accent hover:bg-admin-accent-hover"
              onClick={handleEdit}
              disabled={updateGuest.isPending || !editName.trim()}
            >
              {updateGuest.isPending ? 'Salvando…' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação — Remover */}
      <ConfirmDialog
        open={!!deleteId}
        title="Remover convidado"
        description="O convidado será removido permanentemente da lista."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteGuest.isPending}
      />
    </div>
  )
}
