import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerApi } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { Eye, EyeOff } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha obrigatória'),
  brideName: z.string().min(1, 'Nome da noiva obrigatório'),
  groomName: z.string().min(1, 'Nome do noivo obrigatório'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setError(null)
    try {
      await registerApi(data.name, data.email, data.password, data.brideName, data.groomName)
      navigate('/login')
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError('E-mail já cadastrado')
      } else {
        setError('Erro ao criar conta. Tente novamente.')
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-playfair text-3xl font-semibold text-admin-text">wedding·mc</h1>
          <p className="mt-2 text-sm text-admin-muted">Crie a conta do casal</p>
        </div>

        <div className="rounded-xl border border-admin-border bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome do usuário</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ana Julia Santos"
                autoComplete="name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="brideName">Nome da noiva</Label>
                <Input
                  id="brideName"
                  type="text"
                  placeholder="Ana"
                  {...register('brideName')}
                />
                {errors.brideName && (
                  <p className="text-xs text-destructive">{errors.brideName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="groomName">Nome do noivo</Label>
                <Input
                  id="groomName"
                  type="text"
                  placeholder="Pedro"
                  {...register('groomName')}
                />
                {errors.groomName && (
                  <p className="text-xs text-destructive">{errors.groomName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="voces@casamento.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-admin-muted hover:text-admin-text"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  className="pr-10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-admin-muted hover:text-admin-text"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-admin-accent hover:bg-admin-accent-hover"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando conta…' : 'Criar conta'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-admin-muted">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-admin-accent hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
