import { useState } from 'react'
import type React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Gift, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

function RingIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="14" r="7" />
      <circle cx="12" cy="14" r="3.5" />
      <path d="M9 7.5 L7.5 3 L12 5 L16.5 3 L15 7.5" />
    </svg>
  )
}

type NavIcon = string | LucideIcon | React.FC<{ size?: number }>

const navItems: { to: string; label: string; icon: NavIcon }[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '◈' },
  { to: '/wedding', label: 'Casamento', icon: RingIcon },
  { to: '/guests', label: 'Convidados', icon: User },
  { to: '/gifts', label: 'Presentes', icon: Gift },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'MC'

  return (
    <div className="flex h-screen bg-admin-bg font-inter">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-30 flex h-full w-64 flex-col border-r border-admin-border bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center px-6">
          <span className="font-playfair text-xl font-semibold text-admin-text">wedding·mc</span>
        </div>

        <Separator />

        {/* Navegação */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-admin-accent/10 text-admin-accent'
                    : 'text-admin-muted hover:bg-admin-surface hover:text-admin-text'
                }`
              }
            >
              {typeof item.icon === 'string'
                ? <span className="text-base">{item.icon}</span>
                : <item.icon size={17} strokeWidth={1.5} />
              }
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Separator />

        {/* Rodapé da sidebar */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-admin-accent/10 text-xs text-admin-accent">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-admin-text">{user?.name}</p>
              <p className="truncate text-xs text-admin-muted">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start text-admin-muted hover:text-admin-text"
            onClick={logout}
          >
            Sair
          </Button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header mobile */}
        <header className="flex h-16 items-center border-b border-admin-border bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-admin-muted hover:bg-admin-surface"
            aria-label="Abrir menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-3 font-playfair text-lg font-semibold text-admin-text">
            wedding·mc
          </span>
        </header>

        {/* Área de conteúdo */}
        <main className="flex-1 overflow-y-auto bg-admin-surface p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
