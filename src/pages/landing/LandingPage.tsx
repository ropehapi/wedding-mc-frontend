import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Globe,
  Gift,
  Heart,
  Image,
  Users,
  Link2,
  Check,
  Minus,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Globe,
    title: 'Página pública personalizada',
    description:
      'Crie uma página linda com as informações do casamento, acessível por um link exclusivo.',
  },
  {
    icon: Gift,
    title: 'Lista de presentes',
    description:
      'Gerencie os presentes e deixe os convidados reservarem diretamente pela página.',
  },
  {
    icon: Heart,
    title: 'Confirmação de presença (RSVP)',
    description:
      'Convidados confirmam presença com o código do convite — simples e sem complicações.',
  },
  {
    icon: Image,
    title: 'Galeria de fotos',
    description:
      'Adicione fotos do casal para tornar a página ainda mais especial.',
  },
  {
    icon: Users,
    title: 'Gestão de convidados',
    description:
      'Organize a lista de convidados e acompanhe as confirmações em tempo real.',
  },
  {
    icon: Link2,
    title: 'Link personalizado',
    description:
      'Compartilhe um link único com o nome do casal para todos os convidados.',
  },
]

type PlanFeature = { label: string; included: boolean }

interface Plan {
  name: string
  price: string
  period: string
  description: string
  cta: string
  highlight: boolean
  badge?: string
  features: PlanFeature[]
}

const plans: Plan[] = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    period: '',
    description: 'Para casamentos pequenos e testes',
    cta: 'Começar grátis',
    highlight: false,
    features: [
      { label: 'Até 30 convidados', included: true },
      { label: 'Até 10 presentes', included: true },
      { label: '1 foto (principal)', included: true },
      { label: 'Galeria de fotos', included: false },
      { label: 'Templates de WhatsApp', included: false },
      { label: 'Organização de mesas', included: false },
      { label: 'Suporte', included: false },
    ],
  },
  {
    name: 'Essencial',
    price: 'R$ 49',
    period: '/ evento',
    description: 'Para casamentos médios',
    cta: 'Escolher Essencial',
    highlight: false,
    features: [
      { label: 'Até 150 convidados', included: true },
      { label: 'Até 50 presentes', included: true },
      { label: 'Até 10 fotos', included: true },
      { label: 'Galeria de fotos', included: true },
      { label: 'Templates de WhatsApp', included: false },
      { label: 'Organização de mesas', included: false },
      { label: 'Suporte por e-mail', included: true },
    ],
  },
  {
    name: 'Premium',
    price: 'R$ 99',
    period: '/ evento',
    description: 'Para casamentos grandes',
    cta: 'Escolher Premium',
    highlight: true,
    badge: 'Mais popular',
    features: [
      { label: 'Até 500 convidados', included: true },
      { label: 'Presentes ilimitados', included: true },
      { label: 'Até 30 fotos', included: true },
      { label: 'Galeria de fotos', included: true },
      { label: 'Templates de WhatsApp', included: true },
      { label: 'Organização de mesas', included: true },
      { label: 'Suporte e-mail prioritário', included: true },
    ],
  },
  {
    name: 'Ilimitado',
    price: 'R$ 199',
    period: '/ evento',
    description: 'Para cerimonialistas e uso profissional',
    cta: 'Escolher Ilimitado',
    highlight: false,
    features: [
      { label: 'Convidados ilimitados', included: true },
      { label: 'Presentes ilimitados', included: true },
      { label: 'Fotos ilimitadas', included: true },
      { label: 'Galeria de fotos', included: true },
      { label: 'Templates de WhatsApp', included: true },
      { label: 'Organização de mesas', included: true },
      { label: 'Suporte e-mail + WhatsApp', included: true },
    ],
  },
]

const faqs = [
  {
    q: 'O que é o Felizes para Sempre?',
    a: 'É uma plataforma completa para casamentos. Você cria uma conta, configura as informações do evento e compartilha o link com os convidados. Eles podem confirmar presença, ver a lista de presentes e muito mais.',
  },
  {
    q: 'O plano Gratuito tem prazo de validade?',
    a: 'Não. Sua página fica ativa enquanto a conta existir, sem cobrança nenhuma dentro dos limites do plano.',
  },
  {
    q: 'Posso fazer upgrade de plano depois?',
    a: 'Sim. Você pode começar gratuitamente e fazer upgrade a qualquer momento — basta acessar o painel e escolher o plano desejado.',
  },
  {
    q: 'Como funciona o pagamento?',
    a: 'O pagamento é único por evento, não há mensalidade. Após a confirmação, o plano é ativado imediatamente.',
  },
  {
    q: 'Os dados ficam guardados após o casamento?',
    a: 'Sim. Todas as informações ficam salvas na plataforma. Você pode acessar o histórico quando quiser.',
  },
  {
    q: 'Posso personalizar o link da página?',
    a: 'Sim! O link é baseado no nome do casal (ex: felizesprasempre.com/ana-e-joao), configurado no cadastro.',
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-public-bg font-lato text-public-text" style={{ scrollBehavior: 'smooth' }}>
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Faq />
      <Footer />
    </div>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const { isAuthenticated, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-public-gold/15 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-playfair text-xl font-semibold tracking-tight text-public-text">
          Felizes para Sempre
        </Link>

        {!isLoading && (
          <nav className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="rounded-full bg-public-gold px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-public-gold/90"
              >
                Ir para o painel
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-5 py-2 text-sm font-medium text-public-text transition-colors hover:text-public-gold"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-public-gold px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-public-gold/90"
                >
                  Criar conta grátis
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  function scrollToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#3d2c1e' }}>
      {/* Ornamental background shapes */}
      <div
        className="pointer-events-none absolute -top-32 right-0 h-[600px] w-[600px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #C9956C 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #8A9E7E 0%, transparent 70%)' }}
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        {/* Left — Copy */}
        <div>
          <p className="mb-5 font-lato text-xs font-medium uppercase tracking-[0.25em] text-public-gold">
            A plataforma para o casamento dos seus sonhos
          </p>

          <h1 className="font-cormorant text-5xl font-light leading-tight text-white md:text-6xl lg:text-7xl">
            Tudo que{' '}
            <em className="italic text-public-gold">vocês</em>{' '}
            precisam,
            <br />
            em um só lugar.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
            Página pública personalizada, lista de presentes, confirmação de
            presença e muito mais. Simples para os noivos, encantador para os
            convidados.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-public-gold px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-public-gold/25 transition-all hover:bg-public-gold/90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-public-gold/30"
            >
              Crie sua página grátis
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <button
              onClick={scrollToFeatures}
              className="rounded-full border border-white/25 px-8 py-3.5 text-sm font-medium text-white/80 transition-colors hover:border-public-gold hover:text-public-gold"
            >
              Ver como funciona
            </button>
          </div>
        </div>

        {/* Right — Mockup */}
        <div className="flex justify-center lg:justify-end">
          <WeddingPageMockup />
        </div>
      </div>

      {/* Ornamental divider */}
      <div className="flex items-center justify-center gap-4 pb-8">
        <div className="h-px w-24 bg-public-gold/40" />
        <span className="font-cormorant text-2xl text-public-gold/60">♡</span>
        <div className="h-px w-24 bg-public-gold/40" />
      </div>
    </section>
  )
}

function WeddingPageMockup() {
  return (
    <div
      className="relative w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl shadow-public-text/10"
      style={{ background: 'linear-gradient(160deg, #FAF3E8 0%, #FDF8F0 60%, #f5ede0 100%)' }}
    >
      {/* Top gradient bar */}
      <div
        className="h-40 w-full"
        style={{
          background: 'linear-gradient(135deg, #C9956C 0%, #d4a882 40%, #8A9E7E 100%)',
        }}
      />

      {/* Couple names */}
      <div className="-mt-8 px-8 pb-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white shadow-md">
          <span className="font-cormorant text-2xl text-public-gold">♡</span>
        </div>
        <p className="mt-4 font-lato text-[10px] uppercase tracking-[0.3em] text-public-muted">
          15 de novembro de 2025
        </p>
        <h2 className="mt-2 font-cormorant text-4xl font-light text-public-text">
          Ana{' '}
          <span className="text-public-gold">&amp;</span>
          {' '}João
        </h2>
        <p className="mt-1 font-lato text-xs text-public-muted">
          Igreja São Francisco · São Paulo, SP
        </p>

        <div className="my-5 h-px w-full bg-public-gold/20" />

        {/* Info pills */}
        <div className="flex justify-center gap-3">
          <div className="flex flex-col items-center rounded-xl bg-white/70 px-4 py-2.5 shadow-sm">
            <span className="font-lato text-[9px] uppercase tracking-widest text-public-muted">Data</span>
            <span className="mt-0.5 font-cormorant text-sm text-public-text">15 Nov</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-white/70 px-4 py-2.5 shadow-sm">
            <span className="font-lato text-[9px] uppercase tracking-widest text-public-muted">Horário</span>
            <span className="mt-0.5 font-cormorant text-sm text-public-text">18h00</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-white/70 px-4 py-2.5 shadow-sm">
            <span className="font-lato text-[9px] uppercase tracking-widest text-public-muted">Local</span>
            <span className="mt-0.5 font-cormorant text-sm text-public-text">SP</span>
          </div>
        </div>

        {/* RSVP button */}
        <button className="mt-5 w-full rounded-full bg-public-gold py-2.5 font-lato text-xs font-medium text-white shadow-md shadow-public-gold/30">
          Confirmar Presença
        </button>

        {/* Gifts preview */}
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {['🍽️', '✈️', '🥂'].map((emoji, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-xl bg-white/60 text-xl shadow-sm"
            >
              {emoji}
            </div>
          ))}
        </div>
        <p className="mt-2 font-lato text-[9px] text-public-muted">Lista de Presentes</p>
      </div>

      {/* Floating badge */}
      <div className="absolute right-4 top-4 rounded-full border border-white/30 bg-white/20 px-3 py-1 backdrop-blur-sm">
        <p className="font-lato text-[9px] font-medium text-white">felizesprasempre.com/ana-e-joao</p>
      </div>
    </div>
  )
}

// ─── Features ────────────────────────────────────────────────────────────────

function Features() {
  return (
    <section id="features" className="bg-public-bg py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 font-lato text-xs font-medium uppercase tracking-[0.25em] text-public-gold">
            Funcionalidades
          </p>
          <h2 className="font-cormorant text-4xl font-light text-public-text md:text-5xl">
            Tudo que o seu casamento merece
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-public-muted">
            Do convite digital à lista de presentes, Felizes para Sempre cuida de cada detalhe.
          </p>
          <div className="mx-auto mt-6 h-px w-16 bg-public-gold/40" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-public-gold/15 bg-white p-7 shadow-sm transition-all duration-300 hover:border-public-gold/40 hover:shadow-md hover:shadow-public-gold/8 hover:-translate-y-0.5"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-public-gold/12 transition-colors group-hover:bg-public-gold/20">
                  <Icon size={20} className="text-public-gold" />
                </div>
                <h3 className="font-cormorant text-xl text-public-text">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-public-muted">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function Pricing() {
  return (
    <section id="pricing" className="py-24" style={{ backgroundColor: '#3d2c1e' }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 font-lato text-xs font-medium uppercase tracking-[0.25em] text-public-gold">
            Planos
          </p>
          <h2 className="font-cormorant text-4xl font-light text-white md:text-5xl">
            Escolha o ideal para vocês
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Pagamento único por evento. Sem mensalidades, sem surpresas.
          </p>
          <div className="mx-auto mt-6 h-px w-16 bg-public-gold/50" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-white/40">
          * Os planos são por evento. Não há cobrança recorrente.
        </p>
      </div>
    </section>
  )
}

function PlanCard({ plan }: { plan: Plan }) {
  const highlighted = plan.highlight

  return (
    <div
      className={[
        'relative flex flex-col rounded-2xl p-6 transition-all duration-300',
        highlighted
          ? 'border-2 border-public-gold shadow-xl shadow-black/30 scale-[1.02]'
          : 'border border-white/10 hover:border-white/20 hover:shadow-md',
      ].join(' ')}
      style={{ backgroundColor: highlighted ? '#4e3828' : '#4a3525' }}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-public-gold px-4 py-1 font-lato text-xs font-medium text-white shadow-md shadow-public-gold/30">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="mb-5">
        <h3 className="font-cormorant text-2xl text-white">{plan.name}</h3>
        <p className="mt-1 text-xs text-white/50">{plan.description}</p>
      </div>

      <div className="mb-6 flex items-baseline gap-1">
        <span className={`font-cormorant text-4xl font-light ${highlighted ? 'text-public-gold' : 'text-white'}`}>
          {plan.price}
        </span>
        {plan.period && (
          <span className="text-xs text-white/50">{plan.period}</span>
        )}
      </div>

      <ul className="mb-7 flex-1 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f.label} className="flex items-start gap-2.5">
            {f.included ? (
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-public-gold/20">
                <Check size={10} className="text-public-gold" strokeWidth={3} />
              </span>
            ) : (
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center">
                <Minus size={12} className="text-white/20" />
              </span>
            )}
            <span className={`text-xs ${f.included ? 'text-white/85' : 'text-white/25'}`}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      <Link
        to="/register"
        className={[
          'rounded-full py-2.5 text-center text-xs font-medium transition-all',
          highlighted
            ? 'bg-public-gold text-white shadow-md shadow-public-gold/30 hover:bg-public-gold/90'
            : 'border border-white/20 text-white/80 hover:border-public-gold hover:text-public-gold',
        ].join(' ')}
      >
        {plan.cta}
      </Link>
    </div>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-public-bg py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-12 text-center">
          <h2 className="font-cormorant text-4xl font-light text-public-text md:text-5xl">
            Perguntas frequentes
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-public-gold/40" />
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-public-gold/15 bg-white shadow-sm transition-all hover:border-public-gold/35 hover:shadow-md"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-cormorant text-lg text-public-text">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-public-gold/70 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-public-muted">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ backgroundColor: '#3d2c1e' }} className="text-white/70">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-center">
          <div>
            <p className="font-playfair text-xl font-semibold text-white">
              Felizes para Sempre
            </p>
            <p className="mt-2 text-sm text-white/50">
              Feito com amor para o dia mais especial.
            </p>
          </div>

          <div className="flex justify-center gap-6 text-sm">
            <Link to="/termos" className="transition-colors hover:text-white">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="transition-colors hover:text-white">
              Política de Privacidade
            </Link>
          </div>

          <div className="text-right text-xs text-white/40 md:text-right">
            © 2025 Felizes para Sempre.<br />
            Todos os direitos reservados.
          </div>
        </div>

        <div className="mt-8 h-px bg-white/10" />

        <p className="mt-6 text-center font-cormorant text-base text-white/25 italic">
          ♡ Que o amor de vocês dure para sempre ♡
        </p>
      </div>
    </footer>
  )
}
