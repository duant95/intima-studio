import { supabase } from '@/lib/supabase'

export type SiteConfig = {
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

const DEFAULTS: SiteConfig = {
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

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const { data } = await supabase.from('configuracion').select('clave, valor')
    if (!data) return DEFAULTS
    const config = { ...DEFAULTS }
    for (const row of data) {
      if (row.clave in config) {
        (config as Record<string, string>)[row.clave] = row.valor ?? ''
      }
    }
    return config
  } catch {
    return DEFAULTS
  }
}
