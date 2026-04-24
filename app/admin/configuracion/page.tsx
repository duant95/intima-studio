'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Save, RefreshCw, Upload, X } from 'lucide-react'

type Config = {
  whatsapp_numero: string
  whatsapp_mensaje: string
  hero_imagen_url: string
  intro_imagen_url: string
  taller_home_imagen_1: string
  taller_home_imagen_2: string
  taller_home_imagen_3: string
  taller_home_imagen_4: string
  nosotros_imagen_url: string
  og_imagen_url: string
}

const DEFAULTS: Config = {
  whatsapp_numero: '595981132221',
  whatsapp_mensaje: '¡Hola! Me gustaría consultar sobre un proyecto de diseño de interiores.',
  hero_imagen_url: '',
  intro_imagen_url: '',
  taller_home_imagen_1: '',
  taller_home_imagen_2: '',
  taller_home_imagen_3: '',
  taller_home_imagen_4: '',
  nosotros_imagen_url: '',
  og_imagen_url: '',
}

function ImageUploader({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  hint?: string
}) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `configuracion/${Date.now()}.${ext}`
    const sb = createSupabaseBrowser()
    const { error } = await sb.storage.from('proyectos').upload(fileName, file, { upsert: true })
    if (error) { toast.error('Error subiendo imagen'); setUploading(false); return }
    const { data: { publicUrl } } = sb.storage.from('proyectos').getPublicUrl(fileName)
    onChange(publicUrl)
    setUploading(false)
    toast.success('Imagen subida')
    // reset input
    e.target.value = ''
  }

  return (
    <div>
      <p className="font-body text-xs text-intima-dark/60 mb-2">{label}</p>
      {hint && <p className="font-body text-xs text-intima-dark/30 mb-3">{hint}</p>}

      {value ? (
        <div className="relative w-48 mb-3">
          <div className="aspect-[4/3] overflow-hidden rounded-lg border border-gray-100">
            <img src={value} alt={label} className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 shadow-sm"
          >
            <X size={12} />
          </button>
        </div>
      ) : null}

      <label className="inline-flex items-center gap-2 border border-dashed border-intima-sand rounded-lg px-5 py-3 cursor-pointer hover:border-intima-brown transition-colors">
        <Upload size={14} className="text-intima-brown flex-shrink-0" />
        <span className="font-body text-xs text-intima-dark/60">
          {uploading ? 'Subiendo...' : value ? 'Cambiar imagen' : 'Subir imagen'}
        </span>
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
      </label>
    </div>
  )
}

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<Config>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/configuracion')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        const merged = { ...DEFAULTS }
        for (const key in merged) {
          if (key in data) (merged as Record<string, string>)[key] = data[key] ?? ''
        }
        setConfig(merged)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const setField = (key: keyof Config, value: string) =>
    setConfig((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch('/api/configuracion', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    if (res.ok) {
      toast.success('Configuración guardada ✓')
    } else {
      toast.error('Error al guardar')
    }
    setSaving(false)
  }

  const inputClass = 'w-full bg-white border border-gray-200 rounded-lg font-body text-intima-black px-4 py-2.5 text-sm outline-none focus:border-intima-brown transition-colors'

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-intima-dark/40 font-body text-sm pt-20">
        <RefreshCw size={14} className="animate-spin" /> Cargando configuración...
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-intima-black">Configuración del sitio</h1>
          <p className="font-body text-sm text-intima-dark/50 mt-1">
            Imágenes, WhatsApp y ajustes generales
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-intima-brown text-intima-beige font-body text-sm px-5 py-2.5 rounded hover:bg-intima-black transition-colors disabled:opacity-60"
        >
          <Save size={15} />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      <div className="space-y-6">

        {/* ── WhatsApp ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">
            Botón de WhatsApp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs text-intima-dark/60 block mb-1.5">
                Número (con código de país, sin +)
              </label>
              <input
                type="text"
                value={config.whatsapp_numero}
                onChange={(e) => setField('whatsapp_numero', e.target.value)}
                className={inputClass}
                placeholder="595981132221"
              />
            </div>
            <div>
              <label className="font-body text-xs text-intima-dark/60 block mb-1.5">
                Mensaje predeterminado
              </label>
              <input
                type="text"
                value={config.whatsapp_mensaje}
                onChange={(e) => setField('whatsapp_mensaje', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ── Inicio — Hero ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">
            Página de inicio — Imágenes
          </h2>

          <ImageUploader
            label="Hero (fondo de pantalla completa al entrar)"
            hint="Imagen principal, ocupa toda la pantalla. Recomendado: 1920×1080px o similar horizontal."
            value={config.hero_imagen_url}
            onChange={(url) => setField('hero_imagen_url', url)}
          />

          <ImageUploader
            label="Sección «Nuestro enfoque» (columna derecha)"
            hint="Foto del estudio o de un proyecto. Formato vertical recomendado."
            value={config.intro_imagen_url}
            onChange={(url) => setField('intro_imagen_url', url)}
          />
        </div>

        {/* ── Inicio — El Taller ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">
            Página de inicio — Mosaico El Taller (4 fotos)
          </h2>
          <p className="font-body text-xs text-intima-dark/40">
            Cuatro imágenes cuadradas que se muestran como un collage. Pueden ser fotos de muebles, detalles o del taller.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {(['taller_home_imagen_1', 'taller_home_imagen_2', 'taller_home_imagen_3', 'taller_home_imagen_4'] as const).map((key, i) => (
              <ImageUploader
                key={key}
                label={`Foto ${i + 1}`}
                value={config[key]}
                onChange={(url) => setField(key, url)}
              />
            ))}
          </div>
        </div>

        {/* ── Nosotros ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">
            Página «Nosotros» — Foto del equipo
          </h2>
          <ImageUploader
            label="Foto principal del equipo o del estudio"
            hint="Se muestra como imagen grande en la sección principal de Nosotros."
            value={config.nosotros_imagen_url}
            onChange={(url) => setField('nosotros_imagen_url', url)}
          />
        </div>

        {/* ── Open Graph ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">
            Imagen para compartir en redes (Open Graph)
          </h2>
          <p className="font-body text-xs text-intima-dark/40">
            Esta imagen aparece cuando alguien comparte un link del sitio en WhatsApp, Instagram o redes sociales. Recomendado: 1200×630px.
          </p>
          <ImageUploader
            label="Imagen OG"
            value={config.og_imagen_url}
            onChange={(url) => setField('og_imagen_url', url)}
          />
          {config.og_imagen_url && (
            <p className="font-body text-xs text-intima-brown/60">
              ⚠ Después de cambiar esta imagen, copiá la URL y ponela en el layout.tsx de la aplicación en el campo og_image para que funcione.
            </p>
          )}
        </div>

      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-intima-brown text-intima-beige font-body text-sm px-5 py-2.5 rounded hover:bg-intima-black transition-colors disabled:opacity-60"
        >
          <Save size={15} />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
