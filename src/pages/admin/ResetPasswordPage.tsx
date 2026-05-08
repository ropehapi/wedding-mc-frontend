import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { publicClient } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    new_password: z.string().min(8, 'Mínimo de 8 caracteres'),
    confirm_password: z.string().min(1, 'Confirmação obrigatória'),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  })

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      toast.warning('Link inválido. Solicite a recuperação novamente.')
      navigate('/forgot-password', { replace: true })
    }
  }, [token, navigate])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    try {
      await publicClient.post('/v1/auth/reset-password', {
        token,
        new_password: data.new_password,
      })
      toast.success('Senha redefinida com sucesso. Faça login.')
      navigate('/login', { replace: true })
    } catch {
      setError('root', { message: 'Link inválido ou expirado. Solicite um novo.' })
    }
  }

  if (!token) return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-playfair text-3xl font-semibold text-admin-text">wedding·mc</h1>
          <p className="mt-2 text-sm text-admin-muted">Redefinir senha</p>
        </div>

        <div className="rounded-xl border border-admin-border bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="new_password">Nova senha</Label>
              <Input
                id="new_password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('new_password')}
              />
              {errors.new_password && (
                <p className="text-xs text-destructive">{errors.new_password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm_password">Confirmar senha</Label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('confirm_password')}
              />
              {errors.confirm_password && (
                <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
              )}
            </div>

            {errors.root && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errors.root.message}{' '}
                <Link to="/forgot-password" className="underline">
                  Solicitar novo link
                </Link>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-admin-accent hover:bg-admin-accent-hover"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando…' : 'Redefinir senha'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
