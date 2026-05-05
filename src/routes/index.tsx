import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'
import AdminLayout from '@/components/layout/AdminLayout'
import PublicLayout from '@/components/layout/PublicLayout'
import LoginPage from '@/pages/admin/LoginPage'
import RegisterPage from '@/pages/admin/RegisterPage'
import DashboardPage from '@/pages/admin/DashboardPage'
import WeddingPage from '@/pages/admin/WeddingPage'
import GuestsPage from '@/pages/admin/GuestsPage'
import GiftsPage from '@/pages/admin/GiftsPage'
import TablesPage from '@/pages/admin/TablesPage'
import PublicWeddingPage from '@/pages/public/PublicWeddingPage'
import LandingPage from '@/pages/landing/LandingPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing page — pública, sem guard */}
      <Route path="/" element={<LandingPage />} />

      {/* Rotas públicas — redireciona para /dashboard se autenticado */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Rotas protegidas com layout admin */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/wedding" element={<WeddingPage />} />
          <Route path="/guests" element={<GuestsPage />} />
          <Route path="/gifts" element={<GiftsPage />} />
          <Route path="/tables" element={<TablesPage />} />
        </Route>
      </Route>

      {/* Página pública do casamento */}
      <Route element={<PublicLayout />}>
        <Route path="/:slug" element={<PublicWeddingPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
