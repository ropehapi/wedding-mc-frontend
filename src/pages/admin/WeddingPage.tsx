import { useEffect, useRef, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useWedding, useCreateWedding, useUpdateWedding, useUploadPhoto, useDeletePhoto, useSetCoverPhoto } from '@/hooks/useWedding'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

const BR_STATES = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT',
  'PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO',
]

const schema = z.object({
  bride_name: z.string().min(1, 'Nome da noiva obrigatório'),
  groom_name: z.string().min(1, 'Nome do noivo obrigatório'),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data no formato dd/mm/aaaa'),
  time: z.string().optional(),
  location: z.string().min(1, 'Local obrigatório'),
  city: z.string().optional(),
  state: z.string().optional(),
  description: z.string().optional(),
  links: z.array(
    z.object({
      label: z.string().min(1, 'Rótulo obrigatório'),
      url: z.string().url('URL inválida'),
    }),
  ),
})

type FormData = z.infer<typeof schema>

export default function WeddingPage() {
  const { data: wedding, isLoading } = useWedding()
  const createWedding = useCreateWedding()
  const updateWedding = useUpdateWedding()
  const uploadPhoto = useUploadPhoto()
  const deletePhoto = useDeletePhoto()
  const setCoverPhoto = useSetCoverPhoto()

  const fileRef = useRef<HTMLInputElement>(null)
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { links: [] },
  })

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control,
    name: 'links',
  })

  useEffect(() => {
    if (wedding) {
      reset({
        bride_name: wedding.bride_name,
        groom_name: wedding.groom_name,
        date: wedding.date ? wedding.date.split('-').reverse().join('/') : '',
        time: wedding.time ?? '',
        location: wedding.location,
        city: wedding.city ?? '',
        state: wedding.state ?? '',
        description: wedding.description ?? '',
        links: wedding.links ?? [],
      })
    }
  }, [wedding, reset])

  async function onSubmit(data: FormData) {
    try {
      const [dd, mm, yyyy] = data.date.split('/')
      const payload = {
        ...data,
        date: `${yyyy}-${mm}-${dd}`,
        time: data.time || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        description: data.description || undefined,
      }

      if (wedding) {
        await updateWedding.mutateAsync(payload)
        toast.success('Casamento atualizado!')
      } else {
        await createWedding.mutateAsync(payload as Parameters<typeof createWedding.mutateAsync>[0])
        toast.success('Casamento criado!')
      }
    } catch {
      toast.error('Erro ao salvar. Tente novamente.')
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      toast.error('Formato inválido. Use JPEG, PNG ou WebP.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 10MB.')
      return
    }

    uploadPhoto.mutate(file, {
      onSuccess: () => toast.success('Foto adicionada!'),
      onError: () => toast.error('Erro ao fazer upload.'),
    })

    e.target.value = ''
  }

  async function confirmDeletePhoto() {
    if (!deletePhotoId) return
    try {
      await deletePhoto.mutateAsync(deletePhotoId)
      toast.success('Foto removida.')
    } catch {
      toast.error('Erro ao remover foto.')
    } finally {
      setDeletePhotoId(null)
    }
  }

  function copySlugLink() {
    if (!wedding) return
    const url = `${window.location.origin}/${wedding.slug}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-playfair text-2xl font-semibold text-admin-text">
          {wedding ? 'Editar Casamento' : 'Criar Casamento'}
        </h1>
        <p className="mt-1 text-sm text-admin-muted">
          {wedding
            ? 'Atualize os dados do seu casamento'
            : 'Configure os dados do evento para gerar sua página pública'}
        </p>
      </div>

      {/* Link público */}
      {wedding && (
        <div className="flex items-center gap-3 rounded-lg border border-admin-border bg-white px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-admin-muted">Sua página pública</p>
            <p className="truncate text-sm font-medium text-admin-text">
              {window.location.origin}/{wedding.slug}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={copySlugLink}>
            {copied ? 'Copiado!' : 'Copiar link'}
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Dados do casal */}
        <div className="rounded-xl border border-admin-border bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-admin-muted">
            Dados do Casal
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="bride_name">Nome da noiva</Label>
              <Input id="bride_name" {...register('bride_name')} placeholder="Ana" />
              {errors.bride_name && (
                <p className="text-xs text-destructive">{errors.bride_name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="groom_name">Nome do noivo</Label>
              <Input id="groom_name" {...register('groom_name')} placeholder="Pedro" />
              {errors.groom_name && (
                <p className="text-xs text-destructive">{errors.groom_name.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Dados do evento */}
        <div className="rounded-xl border border-admin-border bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-admin-muted">
            Dados do Evento
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="text" placeholder="dd/mm/aaaa" {...register('date')} />
                {errors.date && (
                  <p className="text-xs text-destructive">{errors.date.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time">Horário (opcional)</Label>
                <Input id="time" type="time" {...register('time')} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Local</Label>
              <Input id="location" {...register('location')} placeholder="Espaço Villa Verde" />
              {errors.location && (
                <p className="text-xs text-destructive">{errors.location.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="city">Cidade (opcional)</Label>
                <Input id="city" {...register('city')} placeholder="São Paulo" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">Estado (opcional)</Label>
                <select
                  id="state"
                  {...register('state')}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Selecione</option>
                  {BR_STATES.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                placeholder="Uma mensagem para os convidados…"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>
        </div>

        {/* Links externos */}
        <div className="rounded-xl border border-admin-border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-admin-muted">
              Links Externos
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendLink({ label: '', url: '' })}
            >
              + Adicionar link
            </Button>
          </div>

          {linkFields.length === 0 && (
            <p className="text-sm text-admin-muted">Nenhum link adicionado.</p>
          )}

          <div className="space-y-3">
            {linkFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Input
                    {...register(`links.${index}.label`)}
                    placeholder="Rótulo (ex: Mapa)"
                  />
                  {errors.links?.[index]?.label && (
                    <p className="text-xs text-destructive">{errors.links[index]?.label?.message}</p>
                  )}
                </div>
                <div className="flex-[2] space-y-1">
                  <Input
                    {...register(`links.${index}.url`)}
                    placeholder="https://..."
                  />
                  {errors.links?.[index]?.url && (
                    <p className="text-xs text-destructive">{errors.links[index]?.url?.message}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-0.5 text-admin-muted hover:text-destructive"
                  onClick={() => removeLink(index)}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {isDirty && (
            <Button type="button" variant="outline" onClick={() => reset()}>
              Descartar
            </Button>
          )}
          <Button
            type="submit"
            className="bg-admin-accent hover:bg-admin-accent-hover"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? 'Salvando…' : wedding ? 'Salvar alterações' : 'Criar casamento'}
          </Button>
        </div>
      </form>

      {/* Galeria de fotos — apenas quando casamento existe */}
      {wedding && (
        <>
          <Separator />
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-playfair text-xl font-semibold text-admin-text">Fotos</h2>
                <p className="mt-0.5 text-sm text-admin-muted">
                  JPEG, PNG ou WebP · máximo 10MB por foto
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
                disabled={uploadPhoto.isPending}
              >
                {uploadPhoto.isPending ? 'Enviando…' : '+ Upload'}
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {wedding.photos.length === 0 ? (
              <div className="rounded-xl border border-dashed border-admin-border py-12 text-center">
                <p className="text-sm text-admin-muted">Nenhuma foto adicionada ainda.</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-admin-accent"
                  onClick={() => fileRef.current?.click()}
                >
                  Fazer upload
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {wedding.photos
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((photo) => (
                    <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg border border-admin-border bg-admin-surface">
                      <img
                        src={photo.url}
                        alt=""
                        className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
                      />
                      {photo.is_cover && (
                        <div className="absolute left-1.5 top-1.5 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                          Principal
                        </div>
                      )}
                      <div className="absolute right-1.5 top-1.5 hidden flex-col gap-1 group-hover:flex">
                        {!photo.is_cover && (
                          <button
                            type="button"
                            onClick={() => setCoverPhoto.mutate(photo.id, {
                              onSuccess: () => toast.success('Foto principal definida!'),
                              onError: () => toast.error('Erro ao definir foto principal.'),
                            })}
                            disabled={setCoverPhoto.isPending}
                            className="rounded-full bg-white/90 p-1 text-xs text-amber-500 shadow"
                            aria-label="Definir como foto principal"
                          >
                            ★
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeletePhotoId(photo.id)}
                          className="rounded-full bg-white/90 p-1 text-xs text-destructive shadow"
                          aria-label="Remover foto"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deletePhotoId}
        title="Remover foto"
        description="Esta ação não pode ser desfeita. A foto será removida permanentemente."
        onConfirm={confirmDeletePhoto}
        onCancel={() => setDeletePhotoId(null)}
        isLoading={deletePhoto.isPending}
      />
    </div>
  )
}
