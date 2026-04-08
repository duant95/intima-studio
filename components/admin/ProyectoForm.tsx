'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createSupabaseBrowser, type Proyecto } from '@/lib/supabase'
import { Upload, X, Star } from 'lucide-react'
import Image from 'next/image'

type FormData = {
  titulo: string
  descripcion: string
  categoria: string
  fecha: string
  destacado: boolean
  orden: number
}

const CATEGORIAS = ['Residencial', 'Comercial', 'Oficinas', 'Hospitalidad', 'Otro']

interface Props {
  proyecto?: Proyecto
  isEditing?: boolean
}

export default function ProyectoForm({ proyecto, isEditing = false }: Props) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [imagenes, setImagenes] = useState<string[]>(proyecto?.imagenes ?? [])
  const [imagenPortada, setImagenPortada] = useState<string>(proyecto?.imagen_portada ?? '')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: proyecto
      ? {
          titulo:      proyecto.titulo,
          descripcion: proyecto.descripcion,
          categoria:   proyecto.categoria,
          fecha:       proyecto.fecha,
          destacado:   proyecto.destacado,
          orden:       proyecto.orden,
        }
      : { fecha: new Date().toISOString().split('T')[0], orden: 99, destacado: true },
  })

  // Subir imágenes a Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const sb = createSupabaseBrowser()
      const { error } = await sb.storage
        .from('proyectos')
        .upload(fileName, file, { upsert: false })

      if (error) {
        toast.error(`Error subiendo ${file.name}`)
        continue
      }

      const { data: { publicUrl } } = sb.storage
        .from('proyectos')
        .getPublicUrl(fileName)

      newUrls.push(publicUrl)
    }

    const updated = [...imagenes, ...newUrls]
    setImagenes(updated)
    if (!imagenPortada && updated.length > 0) setImagenPortada(updated[0])
    setUploading(false)
    toast.success(`${newUrls.length} imagen(es) subida(s)`)
  }

  const removeImagen = (url: string) => {
    const updated = imagenes.filter((i) => i !== url)
    setImagenes(updated)
    if (imagenPortada === url) setImagenPortada(updated[0] ?? '')
  }

  const onSubmit = async (data: FormData) => {
    if (imagenes.length === 0) {
      toast.error('Agregá al menos una imagen')
      return
    }

    const body = {
      ...data,
      imagenes,
      imagen_portada: imagenPortada || imagenes[0],
    }

    const url = isEditing ? `/api/proyectos/${proyecto!.id}` : '/api/proyectos'
    const method = isEditing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      toast.error('Error al guardar el proyecto')
      return
    }

    toast.success(isEditing ? 'Proyecto actualizado' : 'Proyecto creado')
    router.push('/admin/proyectos')
    router.refresh()
  }

  const inputClass = 'w-full bg-white border border-gray-200 rounded-lg font-body text-intima-black px-4 py-2.5 text-sm outline-none focus:border-intima-brown transition-colors'
  const labelClass = 'font-body text-xs tracking-widest uppercase text-intima-dark/50 block mb-1.5'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* Datos del proyecto */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-body font-medium text-intima-dark text-sm">Información del proyecto</h2>

        <div>
          <label className={labelClass}>Título *</label>
          <input
            {...register('titulo', { required: 'El título es requerido' })}
            className={inputClass}
            placeholder="Casa en Lambaré"
          />
          {errors.titulo && <p className="text-red-400 text-xs mt-1">{errors.titulo.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Descripción</label>
          <textarea
            {...register('descripcion')}
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Breve descripción del proyecto..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Categoría *</label>
            <select {...register('categoria', { required: true })} className={inputClass}>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Fecha</label>
            <input
              {...register('fecha')}
              type="date"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Orden (menor = primero)</label>
            <input
              {...register('orden', { valueAsNumber: true })}
              type="number"
              min={0}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            {...register('destacado')}
            type="checkbox"
            id="destacado"
            className="w-4 h-4 accent-intima-brown"
          />
          <label htmlFor="destacado" className="font-body text-sm text-intima-dark flex items-center gap-2">
            <Star size={14} className="text-intima-brown" />
            Mostrar en la página de inicio (destacado)
          </label>
        </div>
      </div>

      {/* Imágenes */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-body font-medium text-intima-dark text-sm mb-5">
          Imágenes del proyecto
        </h2>

        {/* Upload area */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-intima-sand rounded-xl p-10 cursor-pointer hover:border-intima-brown transition-colors mb-5">
          <Upload size={24} className="text-intima-sand mb-2" />
          <p className="font-body text-sm text-intima-dark/60">
            {uploading ? 'Subiendo imágenes...' : 'Clic para subir imágenes (JPG, PNG, WebP)'}
          </p>
          <p className="font-body text-xs text-intima-dark/30 mt-1">Podés subir múltiples a la vez</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {/* Preview de imágenes */}
        {imagenes.length > 0 && (
          <div>
            <p className="font-body text-xs text-intima-dark/40 mb-3">
              Hacé clic en la estrella para elegir la imagen de portada
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {imagenes.map((url) => (
                <div key={url} className="relative group">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Image src={url} alt="" fill className="object-cover" />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

                    {/* Portada badge */}
                    {imagenPortada === url && (
                      <div className="absolute top-2 left-2 bg-intima-brown text-intima-beige text-xs font-body px-2 py-0.5 rounded">
                        Portada
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => setImagenPortada(url)}
                        className="p-1 bg-white/90 rounded hover:bg-white"
                        title="Establecer como portada"
                      >
                        <Star size={12} className={imagenPortada === url ? 'text-intima-brown fill-intima-brown' : 'text-intima-dark'} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImagen(url)}
                        className="p-1 bg-white/90 rounded hover:bg-red-50"
                        title="Eliminar"
                      >
                        <X size={12} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="bg-intima-brown text-intima-beige font-body text-sm tracking-widest uppercase px-8 py-3 rounded hover:bg-intima-black transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar proyecto' : 'Publicar proyecto'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="font-body text-sm text-intima-dark/50 hover:text-intima-dark"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
