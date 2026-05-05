import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import {
  useTables,
  useCreateTable,
  useUpdateTable,
  useDeleteTable,
  useAssignGuest,
  useUnassignGuest,
} from '@/hooks/useTables'
import type { Table, TableGuest } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

// ─── Draggable guest chip ───────────────────────────────────────────────────

const STATUS_DOT: Record<string, string> = {
  pending: 'bg-gray-400',
  confirmed: 'bg-green-500',
  declined: 'bg-red-400',
}

interface GuestChipProps {
  guest: TableGuest
  isDragging?: boolean
}

function GuestChip({ guest, isDragging = false }: GuestChipProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md border border-admin-border bg-white px-2.5 py-1.5 text-sm text-admin-text shadow-sm transition-shadow ${
        isDragging ? 'shadow-md opacity-90' : 'hover:shadow-md'
      }`}
    >
      <span className={`h-2 w-2 flex-shrink-0 rounded-full ${STATUS_DOT[guest.status] ?? 'bg-gray-400'}`} />
      <span className="min-w-0 truncate">{guest.name}</span>
    </div>
  )
}

function DraggableGuest({ guest }: { guest: TableGuest }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: guest.id,
    data: { guest },
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : 1 }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
      <GuestChip guest={guest} />
    </div>
  )
}

// ─── Droppable table card ───────────────────────────────────────────────────

const UNASSIGNED_ID = '__unassigned__'

interface TableCardProps {
  table: Table
  onEdit: (table: Table) => void
  onDelete: (table: Table) => void
  isOver?: boolean
}

function TableCard({ table, onEdit, onDelete, isOver }: TableCardProps) {
  const { setNodeRef } = useDroppable({ id: table.id })
  const pct = table.capacity > 0 ? Math.min((table.occupied / table.capacity) * 100, 100) : 0

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border-2 bg-white p-4 shadow-sm transition-colors ${
        isOver ? 'border-admin-accent bg-admin-accent/5' : 'border-admin-border'
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-playfair text-base font-semibold text-admin-text">{table.name}</h3>
          <p className="mt-0.5 text-xs text-admin-muted">
            {table.occupied}/{table.capacity} lugares
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            onClick={() => onEdit(table)}
            className="rounded p-1.5 text-admin-muted transition-colors hover:bg-admin-surface hover:text-admin-text"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(table)}
            className="rounded p-1.5 text-admin-muted transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-admin-surface">
        <div
          className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-red-400' : 'bg-admin-accent'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Guests drop zone */}
      <div className="min-h-16 space-y-1.5">
        {table.guests.length === 0 ? (
          <p className="py-4 text-center text-xs text-admin-muted">Arraste convidados aqui</p>
        ) : (
          table.guests.map((g) => <DraggableGuest key={g.id} guest={g} />)
        )}
      </div>
    </div>
  )
}

// ─── Unassigned panel ────────────────────────────────────────────────────────

interface UnassignedPanelProps {
  guests: TableGuest[]
  isOver: boolean
}

function UnassignedPanel({ guests, isOver }: UnassignedPanelProps) {
  const { setNodeRef } = useDroppable({ id: UNASSIGNED_ID })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border-2 bg-white p-4 shadow-sm transition-colors ${
        isOver ? 'border-admin-accent bg-admin-accent/5' : 'border-admin-border'
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <Users size={15} className="text-admin-muted" />
        <h3 className="font-playfair text-base font-semibold text-admin-text">Sem Mesa</h3>
        <span className="ml-auto rounded-full bg-admin-surface px-2 py-0.5 text-xs font-medium text-admin-muted">
          {guests.length}
        </span>
      </div>
      <div className="min-h-16 space-y-1.5">
        {guests.length === 0 ? (
          <p className="py-4 text-center text-xs text-admin-muted">Todos os convidados estão em mesas</p>
        ) : (
          guests.map((g) => <DraggableGuest key={g.id} guest={g} />)
        )}
      </div>
    </div>
  )
}

// ─── Table form modal ────────────────────────────────────────────────────────

interface TableFormModalProps {
  open: boolean
  table?: Table | null
  onClose: () => void
  onSubmit: (name: string, capacity: number) => Promise<void>
  isLoading: boolean
}

function TableFormModal({ open, table, onClose, onSubmit, isLoading }: TableFormModalProps) {
  const [name, setName] = useState(table?.name ?? '')
  const [capacity, setCapacity] = useState(String(table?.capacity ?? ''))

  const handleOpen = (v: boolean) => {
    if (!v) onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cap = parseInt(capacity, 10)
    if (!name.trim() || isNaN(cap) || cap < 1) return
    await onSubmit(name.trim(), cap)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{table ? 'Editar mesa' : 'Nova mesa'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="table-name">Nome</Label>
            <Input
              id="table-name"
              placeholder="Ex: Mesa dos Padrinhos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="table-capacity">Capacidade</Label>
            <Input
              id="table-capacity"
              type="number"
              min={1}
              placeholder="Ex: 8"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim() || !capacity}>
              {isLoading ? 'Salvando…' : table ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function TablesPage() {
  const { data, isLoading } = useTables()
  const createTable = useCreateTable()
  const updateTable = useUpdateTable()
  const deleteTable = useDeleteTable()
  const assignGuest = useAssignGuest()
  const unassignGuest = useUnassignGuest()

  const [activeGuest, setActiveGuest] = useState<TableGuest | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTable, setEditTable] = useState<Table | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Table | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const findGuestTableId = useCallback(
    (guestId: string): string | null => {
      if (!data) return null
      const table = data.tables.find((t) => t.guests.some((g) => g.id === guestId))
      return table ? table.id : UNASSIGNED_ID
    },
    [data],
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveGuest(event.active.data.current?.guest ?? null)
  }

  function handleDragOver(event: { over: { id: string } | null }) {
    setOverId(event.over?.id ?? null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveGuest(null)
    setOverId(null)

    const { active, over } = event
    if (!over || !data) return

    const guestId = String(active.id)
    const targetId = String(over.id)
    const sourceId = findGuestTableId(guestId)

    if (sourceId === targetId) return

    try {
      if (sourceId && sourceId !== UNASSIGNED_ID) {
        await unassignGuest.mutateAsync({ tableId: sourceId, guestId })
      }
      if (targetId !== UNASSIGNED_ID) {
        await assignGuest.mutateAsync({ tableId: targetId, guestId })
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      if (msg?.includes('capacity') || msg?.includes('capacidade')) {
        toast.error('Mesa sem capacidade disponível.')
      } else {
        toast.error('Erro ao mover convidado.')
      }
    }
  }

  async function handleCreate(name: string, capacity: number) {
    try {
      await createTable.mutateAsync({ name, capacity })
      toast.success('Mesa criada!')
      setCreateOpen(false)
    } catch {
      toast.error('Erro ao criar mesa.')
    }
  }

  async function handleEdit(name: string, capacity: number) {
    if (!editTable) return
    try {
      await updateTable.mutateAsync({ id: editTable.id, name, capacity })
      toast.success('Mesa atualizada!')
      setEditTable(null)
    } catch {
      toast.error('Erro ao atualizar mesa.')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteTable.mutateAsync(deleteTarget.id)
      toast.success('Mesa removida.')
      setDeleteTarget(null)
    } catch {
      toast.error('Erro ao remover mesa.')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const tables = data?.tables ?? []
  const unassigned = data?.unassigned ?? []

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver as never}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-2xl font-semibold text-admin-text">Mesas</h1>
            <p className="mt-0.5 text-sm text-admin-muted">
              {tables.length} {tables.length === 1 ? 'mesa' : 'mesas'} · {unassigned.length} sem atribuição
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-1.5">
            <Plus size={15} />
            Nova mesa
          </Button>
        </div>

        {/* Board */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Unassigned column */}
          <UnassignedPanel guests={unassigned} isOver={overId === UNASSIGNED_ID} />

          {/* Table cards */}
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              isOver={overId === table.id}
              onEdit={setEditTable}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>

        {tables.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-admin-border py-16 text-center">
            <p className="font-playfair text-lg text-admin-text">Nenhuma mesa criada ainda</p>
            <p className="mt-1 text-sm text-admin-muted">Crie sua primeira mesa para começar a organizar os assentos.</p>
            <Button onClick={() => setCreateOpen(true)} size="sm" className="mt-4 gap-1.5">
              <Plus size={15} />
              Criar primeira mesa
            </Button>
          </div>
        )}
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeGuest && <GuestChip guest={activeGuest} isDragging />}
      </DragOverlay>

      {/* Create modal */}
      <TableFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={createTable.isPending}
      />

      {/* Edit modal */}
      <TableFormModal
        open={!!editTable}
        table={editTable}
        onClose={() => setEditTable(null)}
        onSubmit={handleEdit}
        isLoading={updateTable.isPending}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Remover mesa?"
        description={`A mesa "${deleteTarget?.name}" será removida e os convidados voltarão para a lista sem atribuição.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteTable.isPending}
      />
    </DndContext>
  )
}
