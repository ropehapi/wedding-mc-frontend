import { Link } from 'react-router-dom'
import { useDashboard } from '@/hooks/useDashboard'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { wedding, guestsSummary, giftsSummary, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-playfair text-2xl font-semibold text-admin-text">Dashboard</h1>
        <p className="mt-1 text-sm text-admin-muted">Visão geral do seu casamento</p>
      </div>

      {/* CTA quando casamento não existe */}
      {!wedding && (
        <div className="rounded-xl border border-dashed border-admin-accent/40 bg-admin-accent/5 p-8 text-center">
          <p className="font-playfair text-xl text-admin-text">Configure seu casamento</p>
          <p className="mt-2 text-sm text-admin-muted">
            Comece adicionando os dados do evento para gerar sua página pública.
          </p>
          <Link
            to="/wedding"
            className={cn(buttonVariants(), 'mt-4 bg-admin-accent hover:bg-admin-accent-hover')}
          >
            Configurar agora
          </Link>
        </div>
      )}

      {/* Info do evento */}
      {wedding && (
        <div className="rounded-xl border border-admin-border bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted">
                Seu casamento
              </p>
              <h2 className="mt-1 font-playfair text-xl text-admin-text">
                {wedding.bride_name} &amp; {wedding.groom_name}
              </h2>
              {wedding.date && (
                <p className="mt-1 text-sm text-admin-muted">
                  {formatDate(wedding.date)}
                  {wedding.time && ` · ${wedding.time.slice(0, 5).replace(':', 'h')}`}
                  {wedding.location && ` · ${wedding.location}`}
                </p>
              )}
            </div>
            <Link to="/wedding" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
              Editar
            </Link>
          </div>
        </div>
      )}

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Convidados */}
        <div className="rounded-xl border border-admin-border bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted">
              Convidados
            </p>
            <Link
              to="/guests"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-admin-accent')}
            >
              Ver todos
            </Link>
          </div>

          {guestsSummary ? (
            <div className="mt-4 space-y-3">
              <p className="font-playfair text-3xl font-semibold text-admin-text">
                {guestsSummary.total}
              </p>
              <div className="space-y-1.5">
                <StatRow label="Confirmados" value={guestsSummary.confirmed} color="text-green-600" total={guestsSummary.total} />
                <StatRow label="Pendentes" value={guestsSummary.pending} color="text-yellow-600" total={guestsSummary.total} />
                <StatRow label="Recusaram" value={guestsSummary.declined} color="text-red-600" total={guestsSummary.total} />
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-admin-muted">Nenhum convidado ainda.</p>
          )}

          <div className="mt-4">
            <Link
              to="/guests"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              + Adicionar convidado
            </Link>
          </div>
        </div>

        {/* Presentes */}
        <div className="rounded-xl border border-admin-border bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted">
              Presentes
            </p>
            <Link
              to="/gifts"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-admin-accent')}
            >
              Ver todos
            </Link>
          </div>

          {giftsSummary ? (
            <div className="mt-4 space-y-3">
              <p className="font-playfair text-3xl font-semibold text-admin-text">
                {giftsSummary.total}
              </p>
              <div className="space-y-1.5">
                <StatRow label="Disponíveis" value={giftsSummary.available} color="text-green-600" total={giftsSummary.total} />
                <StatRow label="Reservados" value={giftsSummary.reserved} color="text-blue-600" total={giftsSummary.total} />
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-admin-muted">Nenhum presente ainda.</p>
          )}

          <div className="mt-4">
            <Link
              to="/gifts"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              + Adicionar presente
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatRow({
  label,
  value,
  color,
  total,
}: {
  label: string
  value: number
  color: string
  total: number
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-24 text-admin-muted">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-admin-surface h-1.5">
        <div
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`w-6 text-right font-medium ${color}`}>{value}</span>
    </div>
  )
}
