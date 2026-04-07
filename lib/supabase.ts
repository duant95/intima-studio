import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente para componentes del servidor (lecturas públicas)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para componentes del NAVEGADOR — guarda sesión en cookies (necesario para middleware)
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Cliente con service role para operaciones admin (solo server-side)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// Tipos de la base de datos
export type Proyecto = {
  id: string
  titulo: string
  descripcion: string
  categoria: string
  imagenes: string[]   // URLs de Supabase Storage
  imagen_portada: string
  fecha: string
  destacado: boolean
  orden: number
  created_at: string
}

export type Mensaje = {
  id: string
  nombre: string
  email: string
  telefono?: string
  mensaje: string
  leido: boolean
  created_at: string
}

export type ConfigSite = {
  id: string
  clave: string
  valor: string
}
