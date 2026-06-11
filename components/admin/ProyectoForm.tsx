'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createSupabaseBrowser, type Proyecto } from '@/lib/supabase'
import { Upload, X, Star, Play, GripVertical } from 'lucide-react'
import Image from 'next/image'
import { isVideoUrl, getImageTag, getRealUrl, tagUrl, type ImageTag } from '@/lib/utils'
import {
  DndContext, closestCenter, DragOverlay,
  type DragStartEvent, type DragEndEvent,
  PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type FormData = {
  titulo: string
  descripcion: string
  categoria: string
  ubicacion: string
  fecha: string
  destacado: boolean
  orden: number
}

type ImageItem = { id: string; url: string }

const CATEGORIAS = ['Residencial', 'Comercial', 'Oficinas', 'Hospitalidad', 'Mobiliario', 'Otro']

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function initItems(urls: string[]): ImageItem[] {
  return urls
    .filter((u) => !u.startsWith('__sep:'))
    .map((url) => ({ id: genId(), url }))
}

const NEXT_TAG: Record<string, ImageTag> = { '': 'antes', antes: 'despues', despues: null }

// ── Tarjeta de imagen sortable ──────────────────────────────
function SortableImage({
  item, imagenPortada, onSetPortada, onRemove, onTagChange,
}: {
  item: ImageItem
  imagenPortada: string
  onSetPortada: (url: string) => void
  onRemove: () => void
  onTagChange: (tag: ImageTag) => void
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })

  const realUrl = getRealUrl(item.url)
  const tag = getImageTag(item.url)
  const isVid = isVideoUrl(realUrl)
  const isPortada = imagenPortada === realUrl

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 }

  return (
    <div ref={setNodeRef} style={style} className="relative group select-none">
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-intima-sand/20">

        {/* Drag handle */}
        <button
          ref={setActivatorNodeRef} {...attributes} {...listeners}
          type="button"
          className="absolute top-2 left-2 p-1.5 bg-black/50 rounded cursor-grab active:cursor-grabbing z-20 opacity-0 group-hover:opacity-100 transition-opacity touch-none"
          aria-label="Mover"
        >
          <GripVertical size={13} className="text-white" />
        </button>

        {/* Imagen o video */}
        {isVid ? (
          <>
            <video src={realUrl} muted loop autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Play size={20} className="text-white/50" />
            </div>
          </>
        ) : (
          <Image src={realUrl} alt="" fill className="object-cover" />
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />

        {/* Portada badge */}
        {isPortada && (
          <div className="absolute top-2 right-2 bg-intima-brown text-intima-beige text-[10px] font-body px-1.5 py-0.5 rounded">
            Portada
          </div>
        )}

        {/* Acciones (hover) */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isVid && !isPortada && (
            <button type="button" onClick={() => onSetPortada(realUrl)}
              className="p-1.5 bg-white/90 rounded hover:bg-white" title="Establecer como portada">
              <Star size={11} className="text-intima-dark" />
            </button>
          )}
          <button type="button" onClick={onRemove}
            className="p-1.5 bg-white/90 rounded hover:bg-red-50">
            <X size={11} className="text-red-400" />
          </button>
        </div>

        {/* Badge de sección — siempre visible */}
        <button
          type="button"
          onClick={() => onTagChange(NEXT_TAG[tag ?? ''] ?? null)}
          className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-body font-medium transition-all duration-200 ${
            tag === 'antes'
              ? 'bg-amber-400 text-white shadow-sm'
              : tag === 'despues'
              ? 'bg-intima-brown text-intima-beige shadow-sm'
              : 'bg-black/25 text-white/60 hover:bg-black/40'
          }`}
          title="Cambiar sección: Antes → Después → Sin sección"
        >
          {tag === 'antes' ? 'Antes' : tag === 'despues' ? 'Después' : '· · ·'}
        </button>
      </div>
    </div>
  )
}

// ── Miniatura para DragOverlay ──────────────────────────────
function DragThumb({ item }: { item: ImageItem }) {
  const realUrl = getRealUrl(item.url)
  return (
    <div className="relative aspect-[4/3] w-32 rounded-lg overflow-hidden shadow-xl ring-2 ring-intima-brown/40 rotate-2 opacity-90">
      {isVideoUrl(realUrl)
        ? <div className="w-full h-full bg-intima-black flex items-center justify-center"><Play size={20} className="text-white/60" /></div>
        : <img src={realUrl} alt="" className="w-full h-full object-cover" />
      }
    </div>
  )
}

// ── Form principal ──────────────────────────────────────────
interface Props { proyecto?: Proyecto; isEditing?: boolean }

export default function ProyectoForm({ proyecto, isEditing = false }: Props) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [items, setItems] = useState<ImageItem[]>(() => initItems(proyecto?.imagenes ?? []))
  const [imagenPortada, setImagenPortada] = useState(proyecto?.imagen_portada ?? '')
  const [activeItem, setActiveItem] = useState<ImageItem | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: proyecto
      ? {
          titulo: proyecto.titulo,
          descripcion: proyecto.descripcion,
          categoria: proyecto.categoria,
          ubicacion: proyecto.ubicacion ?? '',
          fecha: proyecto.fecha,
          destacado: proyecto.destacado,
          orden: proyecto.orden,
        }
      : { fecha: new Date().toISOString().split('T')[0], orden: 99, destacado: true, ubicacion: '' },
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    const newItems: ImageItem[] = []
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const sb = createSupabaseBrowser()
      const { error } = await sb.storage.from('proyectos').upload(fileName, file, { upsert: false })
      if (error) { toast.error(`Error subiendo ${file.name}`); continue }
      const { data: { publicUrl } } = sb.storage.from('proyectos').getPublicUrl(fileName)
      newItems.push({ id: genId(), url: publicUrl })
    }
    setItems((prev) => {
      const updated = [...prev, ...newItems]
      if (!imagenPortada && updated.length > 0) {
        const first = updated.find((i) => !isVideoUrl(getRealUrl(i.url)))
        if (first) setImagenPortada(getRealUrl(first.url))
      }
      return updated
    })
    setUploading(false)
    toast.success(`${newItems.length} archivo(s) subido(s)`)
  }

  const removeItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id)
      const removedUrl = getRealUrl(prev.find((i) => i.id === id)?.url ?? '')
      if (imagenPortada === removedUrl) {
        setImagenPortada(updated.find((i) => !isVideoUrl(getRealUrl(i.url)))?.url
          ? getRealUrl(updated.find((i) => !isVideoUrl(getRealUrl(i.url)))!.url)
          : '')
      }
      return updated
    })
  }

  const setTag = (id: string, tag: ImageTag) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, url: tagUrl(i.url, tag) } : i))
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveItem(items.find((i) => i.id === active.id) ?? null)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveItem(null)
    if (!over || active.id === over.id) return
    setItems((prev) => {
      const from = prev.findIndex((i) => i.id === active.id)
      const to = prev.findIndex((i) => i.id === over.id)
      return arrayMove(prev, from, to)
    })
  }

  const onSubmit = async (data: FormData) => {
    const realItems = items.filter((i) => !isVideoUrl(getRealUrl(i.url)) || true)
    if (realItems.length === 0) { toast.error('Agregá al menos una imagen'); return }
    const body = {
      ...data,
      imagenes: items.map((i) => i.url),
      imagen_portada: imagenPortada || getRealUrl(items[0].url),
    }
    const url = isEditing ? `/api/proyectos/${proyecto!.id}` : '/api/proyectos'
    const res = await fetch(url, { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) { toast.error('Error al guardar el proyecto'); return }
    toast.success(isEditing ? 'Proyecto actualizado' : 'Proyecto creado')
    router.refresh()
    router.push('/admin/proyectos')
  }

  const inputClass = 'w-full bg-white border border-gray-200 rounded-lg font-body text-intima-black px-4 py-2.5 text-sm outline-none focus:border-intima-brown transition-colors'
  const labelClass = 'font-body text-xs tracking-widest uppercase text-intima-dark/50 block mb-1.5'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* Datos */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-body font-medium text-intima-dark text-sm">Información del proyecto</h2>

        <div>
          <label className={labelClass}>Título *</label>
          <input {...register('titulo', { required: 'El título es requerido' })} className={inputClass} placeholder="Casa en Lambaré" />
          {errors.titulo && <p className="text-red-400 text-xs mt-1">{errors.titulo.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Descripción</label>
          <textarea {...register('descripcion')} rows={4} className={`${inputClass} resize-none`}
            placeholder="Breve descripción del proyecto..." />
          <p className="font-body text-xs text-intima-dark/30 mt-1">Cada salto de línea aparece como párrafo separado en el sitio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Categoría *</label>
            <select {...register('categoria', { required: true })} className={inputClass}>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Ubicación</label>
            <input {...register('ubicacion')} className={inputClass} placeholder="Ej: Asunción, Paraguay" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fecha</label>
            <input {...register('fecha')} type="date" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Orden (menor = primero)</label>
            <input {...register('orden', { valueAsNumber: true })} type="number" min={0} className={inputClass} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input {...register('destacado')} type="checkbox" id="destacado" className="w-4 h-4 accent-intima-brown" />
          <label htmlFor="destacado" className="font-body text-sm text-intima-dark flex items-center gap-2">
            <Star size={14} className="text-intima-brown" />
            Mostrar en la página de inicio (destacado)
          </label>
        </div>
      </div>

      {/* Imágenes */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-body font-medium text-intima-dark text-sm mb-1">Imágenes del proyecto</h2>
        <p className="font-body text-xs text-intima-dark/40 mb-5">
          Arrastrá para reordenar · <span className="bg-amber-400/20 text-amber-600 px-1 rounded">Antes</span> y <span className="bg-intima-brown/10 text-intima-brown px-1 rounded">Después</span> se etiquetan con el botón en cada foto
        </p>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-intima-sand rounded-xl p-10 cursor-pointer hover:border-intima-brown transition-colors mb-6">
          <Upload size={24} className="text-intima-sand mb-2" />
          <p className="font-body text-sm text-intima-dark/60">{uploading ? 'Subiendo archivos...' : 'Clic para subir imágenes o videos'}</p>
          <p className="font-body text-xs text-intima-dark/30 mt-1">JPG, PNG, WebP, MP4, WebM — múltiples a la vez</p>
          <input type="file" accept="image/*,video/*" multiple onChange={handleImageUpload} disabled={uploading} className="hidden" />
        </label>

        {items.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {items.map((item) => (
                  <SortableImage
                    key={item.id}
                    item={item}
                    imagenPortada={imagenPortada}
                    onSetPortada={setImagenPortada}
                    onRemove={() => removeItem(item.id)}
                    onTagChange={(tag) => setTag(item.id, tag)}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
              {activeItem ? <DragThumb item={activeItem} /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={isSubmitting || uploading}
          className="bg-intima-brown text-intima-beige font-body text-sm tracking-widest uppercase px-8 py-3 rounded hover:bg-intima-black transition-colors disabled:opacity-60">
          {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar proyecto' : 'Publicar proyecto'}
        </button>
        <button type="button" onClick={() => router.back()} className="font-body text-sm text-intima-dark/50 hover:text-intima-dark">
          Cancelar
        </button>
      </div>
    </form>
  )
}
