'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Save, RefreshCw } from 'lucide-react'

type Config = {
  hero_titulo: string
  hero_subtitulo: string
  hero_descripcion: string
  intro_titulo: string
  intro_descripcion: string
  nosotros_bajada: string
  footer_email: string
  footer_instagram: string
  footer_telefono: string
  whatsapp_numero: string
  whatsapp_mensaje: string
}

const DEFAULTS: Config = {
  hero_titulo: 'Espacios con alma',
  hero_subtitulo: 'Diseño de Interiores · Asunción, Paraguay',
  hero_descripcion: 'Transformamos ambientes en experiencias únicas, con atención meticulosa al detalle y un diseño que refleja quien sos.',
  intro_titulo: 'El lujo está en los detalles',
  intro_descripcion: 'En Íntima Studio creemos que cada espacio tiene su propia esencia.',
  nosotros_bajada: 'Estudio de diseño de interiores en Asunción, Paraguay.',
  footer_email: 'hola@intimastudio.com',
  footer_instagram: '@intima.studio',
  footer_telefono: '',
  whatsapp_numero: '595991234567',
  whatsapp_mensaje: '¡Hola! Me gustaría consultar sobre un proyecto de diseño de interiores.',
}

const SECCIONES = [
  {
    titulo: 'Hero (pantalla de inicio)',
    campos: [
      { key: 'hero_subtitulo', label: 'Texto pequeño arriba', tipo: 'text' },
      { key: 'hero_titulo', label: 'Título principal', tipo: 'text' },
      { key: 'hero_descripcion', label: 'Descripción', tipo: 'textarea' },
    ],
  },
  {
    titulo: 'Sección "Nuestro enfoque"',
    campos: [
      { key: 'intro_titulo', label: 'Título', tipo: 'text' },
      { key: 'intro_descripcion', label: 'Descripción', tipo: 'textarea' },
    ],
  },
  {
    titulo: 'Sobre nosotros',
    campos: [
      { key: 'nosotros_bajada', label: 'Texto de presentación', tipo: 'textarea' },
    ],
  },
  {
    titulo: 'Contacto y redes',
    campos: [
      { key: 'footer_email', label: 'Email', tipo: 'email' },
      { key: 'footer_instagram', label: 'Instagram (ej: @intima.studio)', tipo: 'text' },
      { key: 'footer_telefono', label: 'Teléfono (opcional)', tipo: 'text' },
    ],
  },
  {
    titulo: 'Botón de WhatsApp',
    campos: [
      { key: 'whatsapp_numero', label: 'Número (con código de país, sin +)', tipo: 'text' },
      { key: 'whatsapp_mensaje', label: 'Mensaje predeterminado', tipo: 'textarea' },
    ],
  },
]

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<Config>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.from('config_site').select('*').then(({ data }) => {
      if (data && data.length > 0) {
        const merged = { ...DEFAULTS }
        data.forEach(({ clave, valor }: { clave: string; valor: string }) => {
          if (clave in merged) (merged as Record<string, string>)[clave] = valor
        })
        setConfig(merged)
      }
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createSupabaseBrowser()

    const upserts = Object.entries(config).map(([clave, valor]) => ({ clave, valor }))
    const { error } = await supabase
      .from('config_site')
      .upsert(upserts, { onConflict: 'clave' })

    if (error) {
      toast.error('Error al guardar')
    } else {
      toast.success('Configuración guardada')
    }
    setSaving(false)
  }

  const inputClass = 'w-full bg-white border border-gray-200 rounded-lg font-body text-intima-black px-4 py-2.5 text-sm outline-none focus:border-intima-brown transition-colors'
  const labelClass = 'font-body text-xs text-intima-dark/60 block mb-1.5'

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
          <h1 className="font-display text-3xl text-intima-black">Configuración</h1>
          <p className="font-body text-sm text-intima-dark/50 mt-1">
            Editá los textos del sitio sin tocar código
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
        {SECCIONES.map(({ titulo, campos }) => (
          <div key={titulo} className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-body font-medium text-intima-dark text-sm mb-5 pb-4 border-b border-gray-100">
              {titulo}
            </h2>
            <div className="space-y-4">
              {campos.map(({ key, label, tipo }) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  {tipo === 'textarea' ? (
                    <textarea
                      value={(config as Record<string, string>)[key]}
                      onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  ) : (
                    <input
                      type={tipo}
                      value={(config as Record<string, string>)[key]}
                      onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                      className={inputClass}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Botón inferior también */}
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
