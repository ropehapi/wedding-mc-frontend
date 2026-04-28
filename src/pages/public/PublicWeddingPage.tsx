import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import {
  getPublicWedding,
  validateGuestCode,
  submitRsvp,
  getPublicGifts,
  reserveGift,
} from '@/api/public'
import { formatDate, formatTime, formatCurrency } from '@/lib/utils'
import type { PublicGift } from '@/types/api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function PublicWeddingPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: wedding, isLoading, isError } = useQuery({
    queryKey: ['public-wedding', slug],
    queryFn: () => getPublicWedding(slug!).then((r) => r.data),
    retry: (count, error: { response?: { status?: number } }) =>
      error?.response?.status === 404 ? false : count < 2,
    enabled: !!slug,
  })

  const { data: gifts } = useQuery({
    queryKey: ['public-gifts', slug],
    queryFn: () => getPublicGifts(slug!).then((r) => r.data),
    enabled: !!slug && !!wedding,
  })

  if (isLoading) return <PublicSkeleton />

  if (isError || !wedding) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-public-bg px-4 text-center">
        <p className="font-cormorant text-4xl text-public-text">Casamento não encontrado</p>
        <p className="mt-3 text-public-muted">O link que você acessou não existe ou foi removido.</p>
      </div>
    )
  }

  const coverPhoto = (wedding.photos?.find((p) => p.is_cover) ?? wedding.photos?.[0])?.url

  return (
    <div className="min-h-screen bg-public-bg font-lato text-public-text">
      {/* Hero */}
      <section
        className="relative flex min-h-[70vh] items-end justify-center"
        style={coverPhoto ? { backgroundImage: `url(${coverPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {coverPhoto && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        )}
        {!coverPhoto && <div className="absolute inset-0 bg-public-gold/10" />}

        <div className="relative z-10 pb-14 text-center px-4">
          <p className="font-cormorant text-sm tracking-[0.3em] uppercase text-white/80 mb-3">
            {wedding.date ? formatDate(wedding.date) : ''}
          </p>
          <h1 className={`font-cormorant text-5xl font-light leading-tight md:text-7xl ${coverPhoto ? 'text-white' : 'text-public-text'}`}>
            {wedding.bride_name}
            <span className="mx-4 text-public-gold">&amp;</span>
            {wedding.groom_name}
          </h1>
          {(wedding.location || wedding.city) && (
            <p className={`mt-4 text-sm tracking-widest uppercase ${coverPhoto ? 'text-white/80' : 'text-public-muted'}`}>
              {[wedding.location, wedding.city, wedding.state].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </section>

      {/* Detalhes do evento */}
      <section className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
          {wedding.date && (
            <DetailItem icon="♡" label="Data" value={formatDate(wedding.date)} />
          )}
          {wedding.time && (
            <DetailItem icon="◷" label="Horário" value={formatTime(wedding.time)} />
          )}
          {wedding.location && (
            <DetailItem
              icon="◎"
              label="Local"
              value={[wedding.location, wedding.city, wedding.state].filter(Boolean).join(', ')}
            />
          )}
        </div>

        {wedding.description && (
          <p className="mt-10 font-cormorant text-xl leading-relaxed text-public-text/80">
            {wedding.description}
          </p>
        )}

        {/* Links externos */}
        {wedding.links && wedding.links.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {wedding.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-public-gold px-5 py-2 text-sm text-public-gold transition-colors hover:bg-public-gold hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Galeria de fotos */}
      {wedding.photos && wedding.photos.length > 1 && (
        <section className="mx-auto max-w-4xl px-4 pb-16">
          <SectionTitle>Fotos</SectionTitle>
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {wedding.photos
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((photo) => (
                <div key={photo.id} className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={photo.url}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
          </div>
        </section>
      )}

      {/* RSVP */}
      <section className="bg-public-gold/5 py-20">
        <div className="mx-auto max-w-xl px-4 text-center">
          <SectionTitle>Confirmação de Presença</SectionTitle>
          <p className="mt-4 font-cormorant text-xl text-public-text/70">
            Confirme sua presença no casamento através do botão abaixo usando o código de confirmação do convite
          </p>
          <div className="mt-10">
            <RsvpSection slug={slug!} />
          </div>
        </div>
      </section>

      {/* Presentes */}
      {gifts && gifts.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-16">
          <SectionTitle>Lista de Presentes</SectionTitle>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} slug={slug!} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ─── RSVP ───────────────────────────────────────────────────────────────────

function RsvpSection({ slug }: { slug: string }) {
  const [codeModalOpen, setCodeModalOpen] = useState(false)
  const [code, setCode] = useState('')
  const [guest, setGuest] = useState<{ id: string; name: string; status: string } | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitted, setSubmitted] = useState<'confirmed' | 'declined' | null>(null)

  const validateMutation = useMutation({
    mutationFn: () => validateGuestCode(slug, code).then((r) => r.data),
    onSuccess: (data) => {
      setGuest(data)
      setCodeModalOpen(false)
      setConfirmOpen(true)
    },
    onError: (error: { response?: { status?: number } }) => {
      if (error?.response?.status === 403 || error?.response?.status === 404) {
        toast.error('Código inválido. Verifique e tente novamente.')
      } else {
        toast.error('Erro ao validar código. Tente novamente.')
      }
    },
  })

  const rsvpMutation = useMutation({
    mutationFn: (status: 'confirmed' | 'declined') =>
      submitRsvp(slug, guest!.id, code, status).then(() => status),
    onSuccess: (status) => {
      setConfirmOpen(false)
      setSubmitted(status)
    },
    onError: () => toast.error('Erro ao registrar resposta. Tente novamente.'),
  })

  function handleCloseCodeModal() {
    setCodeModalOpen(false)
    setCode('')
  }

  return (
    <>
      {/* Feedback pós-confirmação */}
      {submitted === 'confirmed' && (
        <div className="mb-8 rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="font-cormorant text-4xl text-public-gold">Até lá! 🥂</p>
          <p className="mt-3 text-public-muted">Sua presença foi confirmada. Mal podemos esperar!</p>
        </div>
      )}
      {submitted === 'declined' && (
        <div className="mb-8 rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="font-cormorant text-3xl text-public-text">Obrigado pela resposta</p>
          <p className="mt-3 text-public-muted">Sentiremos sua falta.</p>
        </div>
      )}

      {/* Botão principal */}
      {submitted && (
        <p className="mb-4 font-cormorant text-xl text-public-text/70">Falta confirmar mais alguém?</p>
      )}
      <button
        onClick={() => setCodeModalOpen(true)}
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-public-gold px-10 py-4 text-white shadow-lg shadow-public-gold/30 transition-all duration-300 hover:bg-public-gold/90 hover:shadow-xl hover:shadow-public-gold/40 hover:-translate-y-0.5 active:translate-y-0"
      >
        <span className="font-cormorant text-xl font-light tracking-wide">Confirmar Presença</span>
        <span className="text-white/70 transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>

      {/* Modal — Inserir código */}
      <Dialog open={codeModalOpen} onOpenChange={(v) => !v && handleCloseCodeModal()}>
        <DialogContent className="max-w-sm border-public-gold/20">
          <DialogHeader>
            <DialogTitle className="font-cormorant text-2xl font-light text-public-text text-center">
              Código do Convite
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <p className="text-center text-sm text-public-muted">
              Digite o código de 6 dígitos que acompanha o seu convite.
            </p>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="text-center text-2xl tracking-[0.6em] font-mono h-14 border-public-gold/30 focus-visible:ring-public-gold/40"
              onKeyDown={(e) => e.key === 'Enter' && code.length === 6 && validateMutation.mutate()}
              autoFocus
            />
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              className="w-full rounded-full bg-public-gold hover:bg-public-gold/90 text-white"
              disabled={code.length !== 6 || validateMutation.isPending}
              onClick={() => validateMutation.mutate()}
            >
              {validateMutation.isPending ? 'Verificando…' : 'Continuar'}
            </Button>
            <Button
              variant="ghost"
              className="w-full rounded-full text-public-muted"
              onClick={handleCloseCodeModal}
              disabled={validateMutation.isPending}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal — Confirmação */}
      <Dialog open={confirmOpen} onOpenChange={(v) => !v && setConfirmOpen(false)}>
        <DialogContent className="max-w-sm border-public-gold/20">
          <DialogHeader>
            <DialogTitle className="font-cormorant text-2xl font-light text-public-text text-center">
              Confirmação de Presença
            </DialogTitle>
          </DialogHeader>
          <div className="py-5 text-center space-y-2">
            <p className="text-public-muted text-sm">Olá,</p>
            <p className="font-cormorant text-4xl text-public-text leading-tight">{guest?.name}</p>
            <div className="mx-auto mt-2 h-px w-12 bg-public-gold/30" />
            <p className="text-public-muted text-sm pt-2">Você irá comparecer ao evento?</p>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              className="w-full rounded-full bg-public-gold hover:bg-public-gold/90 text-white"
              disabled={rsvpMutation.isPending}
              onClick={() => rsvpMutation.mutate('confirmed')}
            >
              {rsvpMutation.isPending ? 'Confirmando…' : 'Sim, vou comparecer 🎉'}
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-public-gold/30 text-public-muted hover:text-public-text"
              disabled={rsvpMutation.isPending}
              onClick={() => rsvpMutation.mutate('declined')}
            >
              Não poderei ir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─── Gift Card ───────────────────────────────────────────────────────────────

function GiftCard({ gift, slug }: { gift: PublicGift; slug: string }) {
  const [reserveOpen, setReserveOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-2xl border border-public-gold/20 bg-white shadow-sm">
        <div className="aspect-[4/3] overflow-hidden bg-public-bg">
          {gift.image_url ? (
            <img src={gift.image_url} alt={gift.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-public-gold/30">♡</div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-cormorant text-lg text-public-text">{gift.name}</h3>
          {gift.description && (
            <p className="mt-1 text-xs text-public-muted line-clamp-2">{gift.description}</p>
          )}
          <p className="mt-2 text-sm font-medium text-public-gold">{formatCurrency(gift.price)}</p>

          <div className="mt-auto pt-4 flex items-center justify-between gap-2">
            {!gift.reserved ? (
              <>
                <Button
                  size="sm"
                  className="rounded-full bg-public-gold hover:bg-public-gold/90 text-white text-xs"
                  onClick={() => setReserveOpen(true)}
                >
                  Dar este presente
                </Button>
                {gift.store_url && (
                  <a
                    href={gift.store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-public-gold hover:underline"
                  >
                    Ver na loja ↗
                  </a>
                )}
              </>
            ) : (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                Já reservado
              </span>
            )}
          </div>
        </div>
      </div>

      <ReserveModal
        open={reserveOpen}
        giftName={gift.name}
        slug={slug}
        giftId={gift.id}
        onClose={() => setReserveOpen(false)}
      />
    </>
  )
}

// ─── Reserve Modal ───────────────────────────────────────────────────────────

function ReserveModal({
  open,
  giftName,
  slug,
  giftId,
  onClose,
}: {
  open: boolean
  giftName: string
  slug: string
  giftId: string
  onClose: () => void
}) {
  const qc = useQueryClient()
  const [step, setStep] = useState<'code' | 'confirm' | 'done'>('code')
  const [code, setCode] = useState('')
  const [guest, setGuest] = useState<{ id: string; name: string } | null>(null)

  const validateMutation = useMutation({
    mutationFn: () => validateGuestCode(slug, code).then((r) => r.data),
    onSuccess: (data) => {
      setGuest(data)
      setStep('confirm')
    },
    onError: (error: { response?: { status?: number } }) => {
      if (error?.response?.status === 403 || error?.response?.status === 404) {
        toast.error('Código inválido. Verifique e tente novamente.')
      } else {
        toast.error('Erro ao validar código. Tente novamente.')
      }
    },
  })

  const reserveMutation = useMutation({
    mutationFn: () => reserveGift(slug, giftId, guest!.id, code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['public-gifts', slug] })
      setStep('done')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error('Este presente já foi reservado por outra pessoa.')
      } else {
        toast.error('Erro ao reservar. Tente novamente.')
      }
    },
  })

  function handleClose() {
    setStep('code')
    setCode('')
    setGuest(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-sm border-public-gold/20">
        <DialogHeader>
          <DialogTitle className="font-cormorant text-2xl font-light text-public-text text-center">
            {step === 'done' ? 'Reservado!' : 'Dar este presente'}
          </DialogTitle>
        </DialogHeader>

        {step === 'code' && (
          <>
            <div className="space-y-5 py-2">
              <p className="text-center text-sm text-public-muted">
                Digite o código de 6 dígitos que acompanha o seu convite.
              </p>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-[0.6em] font-mono h-14 border-public-gold/30 focus-visible:ring-public-gold/40"
                onKeyDown={(e) => e.key === 'Enter' && code.length === 6 && validateMutation.mutate()}
                autoFocus
              />
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                className="w-full rounded-full bg-public-gold hover:bg-public-gold/90 text-white"
                disabled={code.length !== 6 || validateMutation.isPending}
                onClick={() => validateMutation.mutate()}
              >
                {validateMutation.isPending ? 'Verificando…' : 'Continuar'}
              </Button>
              <Button
                variant="ghost"
                className="w-full rounded-full text-public-muted"
                onClick={handleClose}
                disabled={validateMutation.isPending}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'confirm' && (
          <>
            <div className="py-5 text-center space-y-2">
              <p className="text-public-muted text-sm">Olá,</p>
              <p className="font-cormorant text-4xl text-public-text leading-tight">{guest?.name}</p>
              <div className="mx-auto mt-2 h-px w-12 bg-public-gold/30" />
              <p className="text-public-muted text-sm pt-2">
                Você deseja reservar{' '}
                <span className="font-medium text-public-text">{giftName}</span>?
              </p>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                className="w-full rounded-full bg-public-gold hover:bg-public-gold/90 text-white"
                disabled={reserveMutation.isPending}
                onClick={() => reserveMutation.mutate()}
              >
                {reserveMutation.isPending ? 'Reservando…' : 'Sim, quero dar este presente 🎁'}
              </Button>
              <Button
                variant="ghost"
                className="w-full rounded-full text-public-muted"
                onClick={handleClose}
                disabled={reserveMutation.isPending}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'done' && (
          <div className="py-4 text-center">
            <p className="text-4xl">🎁</p>
            <p className="mt-3 font-cormorant text-lg text-public-text">Obrigado pelo presente!</p>
            <p className="mt-1 text-sm text-public-muted">{giftName} foi reservado.</p>
            <Button
              className="mt-6 w-full rounded-full bg-public-gold hover:bg-public-gold/90 text-white"
              onClick={handleClose}
            >
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center">
      <h2 className="font-cormorant text-3xl font-light text-public-text">{children}</h2>
      <div className="mx-auto mt-3 h-px w-16 bg-public-gold/40" />
    </div>
  )
}

function DetailItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-2xl text-public-gold">{icon}</span>
      <p className="text-xs tracking-widest uppercase text-public-muted">{label}</p>
      <p className="font-cormorant text-lg text-public-text">{value}</p>
    </div>
  )
}

function PublicSkeleton() {
  return (
    <div className="min-h-screen bg-public-bg">
      <div className="flex min-h-[70vh] animate-pulse items-end justify-center bg-public-gold/10">
        <div className="pb-14 text-center space-y-4">
          <div className="h-4 w-48 mx-auto rounded bg-public-gold/20" />
          <div className="h-12 w-80 mx-auto rounded bg-public-gold/20" />
        </div>
      </div>
    </div>
  )
}
