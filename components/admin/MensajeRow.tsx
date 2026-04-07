'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type Mensaje, createSupabaseBrowser } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { ChevronDown, ChevronUp, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MensajeRow({ mensaje }: { mensaje: Mensaje }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleOpen = async () => {
    setOpen(!open)
    if (!mensaje.leido && !open) {
      const supabase = createSupabaseBrowser()
      await supabase.from('mensajes').update({ leido: true }).eq('id', mensaje.id)
      router.refresh()
    }
  }

  return (
    <div className={cn('border-b border-gray-50 last:border-0', !mensaje.leido && 'bg-intima-beige/20')}>
      <button
        onClick={handleOpen}
        className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-gray-50/50 transition-colors"
      >
        {/* Indicador no leído */}
        <div className="flex-shrink-0">
          {!mensaje.leido
            ? <Circle size={8} className="text-intima-brown fill-intima-brown" />
            : <Circle size={8} className="text-gray-200" />
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <p className={cn('font-body text-sm text-intima-black', !mensaje.leido && 'font-medium')}>
              {mensaje.nombre}
            </p>
            <p className="font-body text-xs text-intima-dark/40 hidden md:block">
              {mensaje.email}
            </p>
          </div>
          <p className="font-body text-sm text-intima-dark/50 truncate mt-0.5">
            {mensaje.mensaje}
          </p>
        </div>

        {/* Fecha */}
        <p className="font-body text-xs text-intima-dark/30 flex-shrink-0 hidden sm:block">
          {formatDate(mensaje.created_at)}
        </p>

        {open ? <ChevronUp size={14} className="text-intima-dark/40 flex-shrink-0" />
               : <ChevronDown size={14} className="text-intima-dark/40 flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-6 pb-5 pt-1 bg-white border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 text-xs font-body text-intima-dark/50">
            <span><strong>Email:</strong> <a href={`mailto:${mensaje.email}`} className="text-intima-brown hover:underline">{mensaje.email}</a></span>
            {mensaje.telefono && <span><strong>Teléfono:</strong> {mensaje.telefono}</span>}
            <span><strong>Fecha:</strong> {formatDate(mensaje.created_at)}</span>
          </div>
          <p className="font-body text-sm text-intima-dark leading-relaxed whitespace-pre-wrap">
            {mensaje.mensaje}
          </p>
          <div className="mt-4">
            <a
              href={`mailto:${mensaje.email}?subject=Re: Tu consulta a Íntima Studio`}
              className="font-body text-xs tracking-widest uppercase text-intima-brown border-b border-intima-brown/30 pb-0.5 hover:border-intima-brown transition-colors"
            >
              Responder por email →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
