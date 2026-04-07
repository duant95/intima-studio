'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase'
import { Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createSupabaseBrowser()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        // Mostrar mensaje específico según el error
        if (authError.message.includes('Email not confirmed')) {
          setError('Confirmá tu email antes de ingresar. Revisá tu bandeja de entrada.')
        } else if (authError.message.includes('Invalid login')) {
          setError('Email o contraseña incorrectos.')
        } else {
          setError(`Error: ${authError.message}`)
        }
        return
      }

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError('Error de conexión. Verificá tu internet e intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-intima-beige flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-12">
          <p className="font-display text-3xl text-intima-black">
            Íntima
            <span className="font-body font-light text-intima-brown text-base ml-1">.studio</span>
          </p>
          <p className="font-body text-xs tracking-widest uppercase text-intima-dark/40 mt-2">
            Panel de administración
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="font-body text-xs tracking-widest uppercase text-intima-dark/50 block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-intima-sand font-body text-intima-black py-3 text-sm outline-none focus:border-intima-brown transition-colors"
              placeholder="admin@intimastudio.com"
            />
          </div>

          <div className="relative">
            <label className="font-body text-xs tracking-widest uppercase text-intima-dark/50 block mb-2">
              Contraseña
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-intima-sand font-body text-intima-black py-3 text-sm outline-none focus:border-intima-brown transition-colors pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-0 bottom-3 text-intima-dark/40 hover:text-intima-dark"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="font-body text-xs text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-intima-brown text-intima-beige font-body text-sm tracking-widest uppercase py-4 hover:bg-intima-black transition-colors duration-300 disabled:opacity-60 mt-4"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
