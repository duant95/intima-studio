'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

type FormData = {
  nombre: string
  email: string
  telefono?: string
  mensaje: string
  _honey?: string
}

export default function ContactoForm() {
  const [sending, setSending] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setSending(true)
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('¡Mensaje enviado! Te respondemos pronto.')
      reset()
    } catch {
      toast.error('Hubo un error. Intentá de nuevo.')
    } finally {
      setSending(false)
    }
  }

  const inputClass = (hasError?: boolean) =>
    cn(
      'w-full bg-transparent border-b font-body text-intima-black placeholder:text-intima-dark/40 py-3 text-sm outline-none transition-colors duration-200 focus:border-intima-brown',
      hasError ? 'border-red-400' : 'border-intima-sand'
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div aria-hidden="true" className="hidden">
        <input {...register('_honey')} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <input
            {...register('nombre', { required: 'Tu nombre es requerido' })}
            placeholder="Nombre *"
            className={inputClass(!!errors.nombre)}
          />
          {errors.nombre && <p className="font-body text-xs text-red-400 mt-1">{errors.nombre.message}</p>}
        </div>
        <div>
          <input
            {...register('email', {
              required: 'El email es requerido',
              pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' },
            })}
            type="email"
            placeholder="Email *"
            className={inputClass(!!errors.email)}
          />
          {errors.email && <p className="font-body text-xs text-red-400 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <input
          {...register('telefono')}
          placeholder="Teléfono / WhatsApp (opcional)"
          className={inputClass()}
        />
      </div>

      <div>
        <textarea
          {...register('mensaje', { required: 'Contanos sobre tu proyecto' })}
          placeholder="Contanos sobre tu proyecto *"
          rows={5}
          className={cn(inputClass(!!errors.mensaje), 'resize-none')}
        />
        {errors.mensaje && <p className="font-body text-xs text-red-400 mt-1">{errors.mensaje.message}</p>}
      </div>

      <button
        type="submit"
        disabled={sending}
        className="flex items-center gap-3 bg-intima-brown text-intima-beige font-body text-sm tracking-widest uppercase px-8 py-4 hover:bg-intima-black transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Send size={14} />
        {sending ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
