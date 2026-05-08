import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
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
            <Input
              id="current_password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('current_password')}
            />
            {errors.current_password && (
              <p className="text-xs text-destructive">{errors.current_password.message}</p>
            )}
          </div>

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
            <Label htmlFor="confirm_password">Confirmar nova senha</Label>
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
