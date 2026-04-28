import { Link } from 'react-router-dom'
import { useDashboard } from '@/hooks/useDashboard'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PieSlice {
  label: string
  value: number
  color: string
}

function PieChart({ slices }: { slices: PieSlice[] }) {
  const total = slices.reduce((s, p) => s + p.value, 0)
  if (total === 0) return null

  const cx = 50
  const cy = 50
  const r = 40

  let startAngle = -Math.PI / 2
  const paths = slices
    .filter((s) => s.value > 0)
    .map((slice) => {
      const angle = (slice.value / total) * 2 * Math.PI
      const endAngle = startAngle + angle
      const x1 = cx + r * Math.cos(startAngle)
      const y1 = cy + r * Math.sin(startAngle)
      const x2 = cx + r * Math.cos(endAngle)
      const y2 = cy + r * Math.sin(endAngle)
      const largeArc = angle > Math.PI ? 1 : 0
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
      startAngle = endAngle
      return { d, color: slice.color, label: slice.label, value: slice.value }
    })

  return (
    <div className="flex items-center gap-4 mt-4">
      <svg viewBox="0 0 100 100" className="w-24 h-24 shrink-0">
        {paths.map((p) => (
          <path key={p.label} d={p.d} fill={p.color} />
        ))}
        <circle cx={cx} cy={cy} r={18} fill="white" />
      </svg>
      <ul className="space-y-1.5 text-sm">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-admin-muted">{s.label}</span>
            <span className="font-medium text-admin-text ml-auto pl-2">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

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
            <div className="mt-2">
              <p className="font-playfair text-3xl font-semibold text-admin-text">
                {guestsSummary.total}
              </p>
              <PieChart
                slices={[
                  { label: 'Confirmados', value: guestsSummary.confirmed, color: '#16a34a' },
                  { label: 'Pendentes', value: guestsSummary.pending, color: '#ca8a04' },
                  { label: 'Recusaram', value: guestsSummary.declined, color: '#dc2626' },
                ]}
              />
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
            <div className="mt-2">
              <p className="font-playfair text-3xl font-semibold text-admin-text">
                {giftsSummary.total}
              </p>
              <PieChart
                slices={[
                  { label: 'Disponíveis', value: giftsSummary.available, color: '#16a34a' },
                  { label: 'Reservados', value: giftsSummary.reserved, color: '#2563eb' },
                ]}
              />
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

