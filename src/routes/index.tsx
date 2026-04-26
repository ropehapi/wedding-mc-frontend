import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'
import LoginPage from '@/pages/admin/LoginPage'
import RegisterPage from '@/pages/admin/RegisterPage'
import DashboardPage from '@/pages/admin/DashboardPage'
import WeddingPage from '@/pages/admin/WeddingPage'
import GuestsPage from '@/pages/admin/GuestsPage'
import GiftsPage from '@/pages/admin/GiftsPage'
import PublicWeddingPage from '@/pages/public/PublicWeddingPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas — redireciona para /dashboard se autenticado */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Rotas protegidas — requer autenticação */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/wedding" element={<WeddingPage />} />
        <Route path="/guests" element={<GuestsPage />} />
        <Route path="/gifts" element={<GiftsPage />} />
      </Route>

      {/* Página pública do casamento */}
      <Route path="/:slug" element={<PublicWeddingPage />} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div>404 — Página não encontrada</div>} />
    </Routes>
  )
}
