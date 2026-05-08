import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    current_password: z.string().min(1, 'Senha atual obrigatória'),
    new_password: z.string().min(8, 'Mínimo de 8 caracteres'),
    confirm_password: z.string().min(1, 'Confirmação obrigatória'),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  })

type FormData = z.infer<typeof schema>

export default function AccountPage() {
  const { changePassword } = useAuth()
  const [showPasswords, setShowPasswords] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    try {
      await changePassword(data.current_password, data.new_password)
      toast.success('Senha alterada com sucesso')
      reset()
    } catch {
      setError('current_password', { message: 'Senha atual incorreta' })
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-playfair text-2xl font-semibold text-admin-text">Conta</h1>
      <p className="mt-1 text-sm text-admin-muted">Gerencie as configurações da sua conta</p>

      <div className="mt-6 rounded-xl border border-admin-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-medium text-admin-text">Alterar senha</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="current_password">Senha atual</Label>
            <div className="relative">
              <Input
                id="current_password"
                type={showPasswords ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                className="pr-10"
                {...register('current_password')}
              />
              <button
                type="button"
                onClick={() => setShowPasswords((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-admin-muted hover:text-admin-text"
                tabIndex={-1}
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.current_password && (
              <p className="text-xs text-destructive">{errors.current_password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new_password">Nova senha</Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showPasswords ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                className="pr-10"
                {...register('new_password')}
              />
              <button
                type="button"
                onClick={() => setShowPasswords((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-admin-muted hover:text-admin-text"
                tabIndex={-1}
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.new_password && (
              <p className="text-xs text-destructive">{errors.new_password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm_password">Confirmar nova senha</Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showPasswords ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                className="pr-10"
                {...register('confirm_password')}
              />
              <button
                type="button"
                onClick={() => setShowPasswords((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-admin-muted hover:text-admin-text"
                tabIndex={-1}
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-admin-accent hover:bg-admin-accent-hover"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando…' : 'Salvar senha'}
          </Button>
        </form>
      </div>
    </div>
  )
}
