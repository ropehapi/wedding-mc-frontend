import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { publicClient } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    try {
      await publicClient.post('/v1/auth/forgot-password', { email: data.email })
    } catch {
      // intencional — não vazar se e-mail existe
    }
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-playfair text-3xl font-semibold text-admin-text">wedding·mc</h1>
          <p className="mt-2 text-sm text-admin-muted">Recuperar senha</p>
        </div>

        <div className="rounded-xl border border-admin-border bg-white p-8 shadow-sm">
          {submitted ? (
            <p className="text-center text-sm text-admin-text">
              Se esse e-mail estiver cadastrado, você receberá as instruções em breve.
            </p>
          ) : (
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

              <Button
                type="submit"
                className="w-full bg-admin-accent hover:bg-admin-accent-hover"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando…' : 'Enviar instruções'}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-admin-muted">
          <Link to="/login" className="font-medium text-admin-accent hover:underline">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  )
}
