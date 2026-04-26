import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setError(null)
    try {
      await login(data.email, data.password)
    } catch {
      setError('E-mail ou senha incorretos')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-playfair text-3xl font-semibold text-admin-text">wedding·mc</h1>
          <p className="mt-2 text-sm text-admin-muted">Entre na sua conta</p>
        </div>

        <div className="rounded-xl border border-admin-border bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
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
              {isSubmitting ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-admin-muted">
          Ainda não tem conta?{' '}
          <Link to="/register" className="font-medium text-admin-accent hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
