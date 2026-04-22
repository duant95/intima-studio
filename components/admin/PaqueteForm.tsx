'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createSupabaseBrowser } from '@/lib/supabase'
import { Plus, Trash2, Upload, Star } from 'lucide-react'
import type { Paquete } from '@/app/(site)/servicios/page'

const CATEGORIAS = ['Dormitorio', 'Cocina', 'Baño', 'Living', 'Exterior', 'Oficina', 'Completo', 'Otro']

type FormData = {
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  destacado: boolean
  activo: boolean
  orden: number
}

interface Props { paquete?: Paquete; isEditing?: boolean }

export default function PaqueteForm({ paquete, isEditing = false }: Props) {
  const router = useRouter()
  const [imagenUrl, setImagenUrl] = useState(paquete?.imagen_url ?? '')
  const [uploading, setUploading] = useState(false)
  const [incluye, setIncluye] = useState<string[]>(paquete?.incluye ?? [''])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: paquete
      ? { nombre: paquete.nombre, descripcion: paquete.descripcion ?? '', precio: paquete.precio ?? 0, categoria: paquete.categoria, destacado: paquete.destacado, activo: true, orden: paquete.orden }
      : { categoria: 'Dormitorio', destacado: false, activo: true, orden: 99 },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `paquetes/${Date.now()}.${ext}`
    const sb = createSupabaseBrowser()
    const { error } = await sb.storage.from('proyectos').upload(fileName, file, { upsert: true })
    if (error) { toast.error('Error subiendo imagen'); setUploading(false); return }
    const { data: { publicUrl } } = sb.storage.from('proyectos').getPublicUrl(fileName)
    setImagenUrl(publicUrl)
    setUploading(false)
    toast.success('Imagen subida')
  }

  const addItem = () => setIncluye([...incluye, ''])
  const removeItem = (i: number) => setIncluye(incluye.filter((_, idx) => idx !== i))
  const updateItem = (i: number, val: string) => setIncluye(incluye.map((item, idx) => idx === i ? val : item))

  const onSubmit = async (data: FormData) => {
    const body = { ...data, imagen_url: imagenUrl || null, incluye: incluye.filter(Boolean) }
    const url = isEditing ? `/api/servicios/${paquete!.id}` : '/api/servicios'
    const method = isEditing ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) { toast.error('Error al guardar'); return }
    toast.success(isEditing ? 'Paquete actualizado' : 'Paquete creado')
    router.push('/admin/servicios')
    router.refresh()
  }

  const inputClass = 'w-full bg-white border border-gray-200 rounded-lg font-body text-intima-black px-4 py-2.5 text-sm outline-none focus:border-intima-brown transition-colors'
  const labelClass = 'font-body text-xs tracking-widest uppercase text-intima-dark/50 block mb-1.5'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-body font-medium text-intima-dark text-sm">Información del paquete</h2>

        <div>
          <label className={labelClass}>Nombre del paquete *</label>
          <input {...register('nombre', { required: true })} className={inputClass} placeholder="Diseño de Dormitorio Completo" />
          {errors.nombre && <p className="text-red-400 text-xs mt-1">Requerido</p>}
        </div>

        <div>
          <label className={labelClass}>Descripción</label>
          <textarea {...register('descripcion')} rows={3} className={`${inputClass} resize-none`} placeholder="Breve descripción del paquete..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Categoría</label>
            <select {...register('categoria')} className={inputClass}>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Precio (₲)</label>
            <input {...register('precio', { valueAsNumber: true })} type="number" min={0} className={inputClass} placeholder="3500000" />
          </div>
          <div>
            <label className={labelClass}>Orden</label>
            <input {...register('orden', { valueAsNumber: true })} type="number" min={0} className={inputClass} />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register('destacado')} type="checkbox" className="w-4 h-4 accent-intima-brown" />
            <span className="font-body text-sm text-intima-dark flex items-center gap-1.5"><Star size={13} className="text-intima-brown" /> Destacado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register('activo')} type="checkbox" className="w-4 h-4 accent-intima-brown" />
            <span className="font-body text-sm text-intima-dark">Activo (visible en el sitio)</span>
          </label>
        </div>
      </div>

      {/* Qué incluye */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-body font-medium text-intima-dark text-sm mb-4">¿Qué incluye?</h2>
        <div className="space-y-2">
          {incluye.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => updateItem(i, e.target.value)}
                className={`${inputClass} flex-1`}
                placeholder="Ej: Proyecto 3D completo"
              />
              {incluye.length > 1 && (
                <button type="button" onClick={() => removeItem(i)} className="p-2 text-red-400 hover:text-red-600">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addItem} className="mt-3 flex items-center gap-1.5 font-body text-xs text-intima-brown hover:text-intima-black transition-colors">
          <Plus size={13} /> Agregar ítem
        </button>
      </div>

      {/* Imagen */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-body font-medium text-intima-dark text-sm mb-4">Imagen del paquete</h2>
        {imagenUrl && (
          <div className="relative aspect-[4/3] w-48 mb-4 overflow-hidden rounded-lg">
            <img src={imagenUrl} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => setImagenUrl('')} className="absolute top-2 right-2 bg-white/80 rounded p-1 text-red-400 hover:text-red-600">✕</button>
          </div>
        )}
        <label className="flex items-center gap-3 border-2 border-dashed border-intima-sand rounded-xl p-6 cursor-pointer hover:border-intima-brown transition-colors w-full md:w-72">
          <Upload size={18} className="text-intima-sand flex-shrink-0" />
          <span className="font-body text-sm text-intima-dark/60">
            {uploading ? 'Subiendo...' : imagenUrl ? 'Cambiar imagen' : 'Subir imagen'}
          </span>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={isSubmitting || uploading} className="bg-intima-brown text-intima-beige font-body text-sm tracking-widest uppercase px-8 py-3 rounded hover:bg-intima-black transition-colors disabled:opacity-60">
          {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear paquete'}
        </button>
        <button type="button" onClick={() => router.back()} className="font-body text-sm text-intima-dark/50 hover:text-intima-dark">Cancelar</button>
      </div>
    </form>
  )
}
