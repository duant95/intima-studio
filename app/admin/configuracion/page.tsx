'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase'
import { CONFIG_DEFAULTS, parseTallerTipos, type TallerTipo } from '@/lib/config'
import toast from 'react-hot-toast'
import { Save, RefreshCw, Upload, X, Plus, Trash2 } from 'lucide-react'

type Config = typeof CONFIG_DEFAULTS

// ── Componente upload de imagen ────────────────────────────
function ImageUploader({
  label, value, onChange, hint, aspect = '4/3',
}: {
  label: string; value: string; onChange: (url: string) => void; hint?: string; aspect?: string
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
    e.target.value = ''
  }

  return (
    <div>
      {label && <p className="font-body text-xs text-intima-dark/60 mb-1.5">{label}</p>}
      {hint && <p className="font-body text-xs text-intima-dark/30 mb-2">{hint}</p>}
      {value && (
        <div className="relative w-40 mb-3">
          <div className={`overflow-hidden rounded border border-gray-100 ${aspect === '16/9' ? 'aspect-video' : 'aspect-[4/3]'}`}>
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
          <button type="button" onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 shadow-sm">
            <X size={10} />
          </button>
        </div>
      )}
      <label className="inline-flex items-center gap-2 border border-dashed border-intima-sand rounded px-4 py-2 cursor-pointer hover:border-intima-brown transition-colors text-xs">
        <Upload size={12} className="text-intima-brown flex-shrink-0" />
        <span className="font-body text-intima-dark/60">
          {uploading ? 'Subiendo...' : value ? 'Cambiar' : 'Subir imagen'}
        </span>
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
      </label>
    </div>
  )
}

// ── Editor de tipos de taller ─────────────────────────────
function TallerTiposEditor({
  value, onChange,
}: {
  value: string; onChange: (v: string) => void
}) {
  const [tipos, setTipos] = useState<TallerTipo[]>(() => parseTallerTipos(value))
  const [uploading, setUploading] = useState<number | null>(null)

  const sync = (next: TallerTipo[]) => {
    setTipos(next)
    onChange(JSON.stringify(next))
  }

  const add = () => sync([...tipos, { imagen_url: '', nombre: '', desc: '' }])
  const remove = (i: number) => sync(tipos.filter((_, idx) => idx !== i))
  const update = (i: number, field: keyof TallerTipo, val: string) =>
    sync(tipos.map((t, idx) => idx === i ? { ...t, [field]: val } : t))

  const uploadImg = async (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(i)
    const ext = file.name.split('.').pop()
    const fileName = `taller/${Date.now()}.${ext}`
    const sb = createSupabaseBrowser()
    const { error } = await sb.storage.from('proyectos').upload(fileName, file, { upsert: true })
    if (error) { toast.error('Error subiendo'); setUploading(null); return }
    const { data: { publicUrl } } = sb.storage.from('proyectos').getPublicUrl(fileName)
    update(i, 'imagen_url', publicUrl)
    setUploading(null)
    toast.success('Imagen subida')
    e.target.value = ''
  }

  const inputClass = 'w-full bg-white border border-gray-200 rounded font-body text-intima-black px-3 py-2 text-sm outline-none focus:border-intima-brown transition-colors'

  return (
    <div className="space-y-4">
      {tipos.map((tipo, i) => (
        <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl text-intima-brown/30 leading-none">{String(i + 1).padStart(2, '0')}</span>
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            {/* Imagen */}
            <div>
              {tipo.imagen_url ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded border border-gray-100 mb-2">
                  <img src={tipo.imagen_url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => update(i, 'imagen_url', '')}
                    className="absolute top-1 right-1 w-5 h-5 bg-white/80 rounded-full flex items-center justify-center text-red-400">
                    <X size={10} />
                  </button>
                </div>
              ) : null}
              <label className="flex items-center gap-1.5 border border-dashed border-intima-sand rounded px-3 py-2 cursor-pointer hover:border-intima-brown transition-colors text-xs w-full">
                <Upload size={11} className="text-intima-brown" />
                <span className="font-body text-intima-dark/60 text-xs">
                  {uploading === i ? 'Subiendo...' : tipo.imagen_url ? 'Cambiar' : 'Foto'}
                </span>
                <input type="file" accept="image/*" onChange={(e) => uploadImg(i, e)} disabled={uploading === i} className="hidden" />
              </label>
            </div>
            {/* Texto */}
            <div className="md:col-span-2 space-y-2">
              <input
                value={tipo.nombre}
                onChange={(e) => update(i, 'nombre', e.target.value)}
                placeholder="Nombre (ej: Mesas & Escritorios)"
                className={inputClass}
              />
              <textarea
                value={tipo.desc}
                onChange={(e) => update(i, 'desc', e.target.value)}
                placeholder="Descripción corta"
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="flex items-center gap-1.5 font-body text-xs text-intima-brown hover:text-intima-black transition-colors mt-2">
        <Plus size={13} /> Agregar tipo de mueble
      </button>
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────
const TABS = ['General', 'Inicio', 'El Taller', 'Nosotros', 'Contacto'] as const
type Tab = typeof TABS[number]

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<Config>({ ...CONFIG_DEFAULTS })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<Tab>('General')

  useEffect(() => {
    fetch('/api/configuracion')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        const merged = { ...CONFIG_DEFAULTS }
        for (const key in merged) {
          if (key in data && data[key] !== undefined) {
            (merged as Record<string, string>)[key] = data[key]
          }
        }
        setConfig(merged)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const set = (key: keyof Config, value: string) =>
    setConfig((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch('/api/configuracion', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    if (res.ok) toast.success('Configuración guardada ✓')
    else toast.error('Error al guardar')
    setSaving(false)
  }

  const input = 'w-full bg-white border border-gray-200 rounded-lg font-body text-intima-black px-4 py-2.5 text-sm outline-none focus:border-intima-brown transition-colors'
  const label = 'font-body text-xs text-intima-dark/60 block mb-1.5'
  const card = 'bg-white rounded-xl border border-gray-100 p-6 space-y-5'

  if (loading) return (
    <div className="flex items-center gap-2 text-intima-dark/40 font-body text-sm pt-20">
      <RefreshCw size={14} className="animate-spin" /> Cargando...
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-intima-black">Configuración</h1>
          <p className="font-body text-sm text-intima-dark/50 mt-1">Textos, imágenes y ajustes del sitio</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-intima-brown text-intima-beige font-body text-sm px-5 py-2.5 rounded hover:bg-intima-black transition-colors disabled:opacity-60">
          <Save size={15} />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-8 bg-white rounded-xl border border-gray-100 p-1.5 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`font-body text-xs tracking-widest uppercase px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors duration-200 ${
              tab === t
                ? 'bg-intima-brown text-intima-beige'
                : 'text-intima-dark/50 hover:text-intima-dark'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── TAB: General ── */}
      {tab === 'General' && (
        <div className="space-y-6">
          <div className={card}>
            <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">
              Botón de WhatsApp
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={label}>Número (con código de país, sin +)</label>
                <input type="text" value={config.whatsapp_numero} onChange={(e) => set('whatsapp_numero', e.target.value)} className={input} placeholder="595981132221" />
              </div>
              <div>
                <label className={label}>Mensaje predeterminado</label>
                <input type="text" value={config.whatsapp_mensaje} onChange={(e) => set('whatsapp_mensaje', e.target.value)} className={input} />
              </div>
            </div>
          </div>

          <div className={card}>
            <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">
              Imagen para compartir en redes (Open Graph)
            </h2>
            <p className="font-body text-xs text-intima-dark/40">Aparece al compartir el sitio en WhatsApp, Instagram, etc. Recomendado: 1200×630px.</p>
            <ImageUploader label="Imagen OG" value={config.og_imagen_url} onChange={(url) => set('og_imagen_url', url)} aspect="16/9" />
          </div>
        </div>
      )}

      {/* ── TAB: Inicio ── */}
      {tab === 'Inicio' && (
        <div className="space-y-6">
          <div className={card}>
            <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">Hero — imagen y textos</h2>
            <ImageUploader
              label="Imagen de fondo (pantalla completa al entrar)"
              hint="Horizontal. Recomendado: 1920×1080px o mayor."
              value={config.hero_imagen_url}
              onChange={(url) => set('hero_imagen_url', url)}
              aspect="16/9"
            />
            <div>
              <label className={label}>Texto pequeño arriba</label>
              <input value={config.inicio_hero_subtitulo} onChange={(e) => set('inicio_hero_subtitulo', e.target.value)} className={input} />
            </div>
            <div>
              <label className={label}>Título principal</label>
              <input value={config.inicio_hero_titulo} onChange={(e) => set('inicio_hero_titulo', e.target.value)} className={input} />
              <p className="text-xs text-intima-dark/30 mt-1">La segunda línea se muestra en cursiva automáticamente.</p>
            </div>
            <div>
              <label className={label}>Descripción</label>
              <textarea value={config.inicio_hero_descripcion} onChange={(e) => set('inicio_hero_descripcion', e.target.value)} rows={3} className={`${input} resize-none`} />
            </div>
          </div>

          <div className={card}>
            <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">Sección «Nuestro enfoque»</h2>
            <ImageUploader
              label="Imagen (columna derecha, formato vertical recomendado)"
              value={config.intro_imagen_url}
              onChange={(url) => set('intro_imagen_url', url)}
            />
            <div>
              <label className={label}>Título</label>
              <input value={config.inicio_intro_titulo} onChange={(e) => set('inicio_intro_titulo', e.target.value)} className={input} />
            </div>
            <div>
              <label className={label}>Texto (los párrafos se separan con salto de línea)</label>
              <textarea value={config.inicio_intro_texto} onChange={(e) => set('inicio_intro_texto', e.target.value)} rows={5} className={`${input} resize-none`} />
            </div>
          </div>

          <div className={card}>
            <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">Mosaico El Taller (4 fotos)</h2>
            <p className="font-body text-xs text-intima-dark/40">Cuatro fotos cuadradas que se muestran como collage en la sección del Taller dentro del inicio.</p>
            <div className="grid grid-cols-2 gap-4">
              {(['taller_home_imagen_1', 'taller_home_imagen_2', 'taller_home_imagen_3', 'taller_home_imagen_4'] as const).map((key, i) => (
                <ImageUploader key={key} label={`Foto ${i + 1}`} value={config[key]} onChange={(url) => set(key, url)} />
              ))}
            </div>
          </div>

          <div className={card}>
            <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">Sección final — CTA</h2>
            <div>
              <label className={label}>Título</label>
              <input value={config.inicio_cta_titulo} onChange={(e) => set('inicio_cta_titulo', e.target.value)} className={input} />
            </div>
            <div>
              <label className={label}>Descripción</label>
              <textarea value={config.inicio_cta_descripcion} onChange={(e) => set('inicio_cta_descripcion', e.target.value)} rows={3} className={`${input} resize-none`} />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: El Taller ── */}
      {tab === 'El Taller' && (
        <div className="space-y-6">
          <div className={card}>
            <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">
              Sección «Qué fabricamos» — tipos de muebles
            </h2>
            <p className="font-body text-xs text-intima-dark/40 mb-2">
              Cada tipo aparece como una card con imagen y descripción corta en la página El Taller.
            </p>
            <TallerTiposEditor
              value={config.taller_tipos}
              onChange={(v) => set('taller_tipos', v)}
            />
          </div>
        </div>
      )}

      {/* ── TAB: Nosotros ── */}
      {tab === 'Nosotros' && (
        <div className="space-y-6">
          <div className={card}>
            <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">Foto del equipo</h2>
            <ImageUploader
              label="Foto principal (imagen grande en la página Nosotros)"
              value={config.nosotros_imagen_url}
              onChange={(url) => set('nosotros_imagen_url', url)}
            />
          </div>

          <div className={card}>
            <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">Textos</h2>
            <div>
              <label className={label}>Bajada del título (texto junto al h1)</label>
              <textarea value={config.nosotros_intro} onChange={(e) => set('nosotros_intro', e.target.value)} rows={3} className={`${input} resize-none`} />
            </div>
            <div>
              <label className={label}>Descripción del estudio (cada párrafo separado por salto de línea)</label>
              <textarea value={config.nosotros_descripcion} onChange={(e) => set('nosotros_descripcion', e.target.value)} rows={6} className={`${input} resize-none`} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={label}>Stat 1 — número</label>
                <input value={config.nosotros_stat_1_num} onChange={(e) => set('nosotros_stat_1_num', e.target.value)} className={input} placeholder="+50" />
              </div>
              <div>
                <label className={label}>Stat 1 — etiqueta</label>
                <input value={config.nosotros_stat_1_label} onChange={(e) => set('nosotros_stat_1_label', e.target.value)} className={input} placeholder="Proyectos realizados" />
              </div>
              <div>
                <label className={label}>Stat 2 — número</label>
                <input value={config.nosotros_stat_2_num} onChange={(e) => set('nosotros_stat_2_num', e.target.value)} className={input} placeholder="5+" />
              </div>
              <div>
                <label className={label}>Stat 2 — etiqueta</label>
                <input value={config.nosotros_stat_2_label} onChange={(e) => set('nosotros_stat_2_label', e.target.value)} className={input} placeholder="Años de experiencia" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Contacto ── */}
      {tab === 'Contacto' && (
        <div className={card}>
          <h2 className="font-body font-medium text-intima-dark text-sm pb-3 border-b border-gray-100">Datos de contacto</h2>
          <div>
            <label className={label}>Email</label>
            <input type="email" value={config.contacto_email} onChange={(e) => set('contacto_email', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Instagram (sin @ ni URL, solo el handle)</label>
            <input value={config.contacto_instagram.replace('@', '')} onChange={(e) => set('contacto_instagram', e.target.value.replace('@', ''))} className={input} placeholder="intima.studio" />
          </div>
          <div>
            <label className={label}>Ubicación</label>
            <input value={config.contacto_ubicacion} onChange={(e) => set('contacto_ubicacion', e.target.value)} className={input} placeholder="Asunción, Paraguay" />
          </div>
        </div>
      )}

      {/* Save bottom */}
      <div className="mt-8 flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-intima-brown text-intima-beige font-body text-sm px-5 py-2.5 rounded hover:bg-intima-black transition-colors disabled:opacity-60">
          <Save size={15} />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
