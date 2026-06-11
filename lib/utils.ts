import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)
}

// ─── Sistema de etiquetas antes/después ────────────────────
export type ImageTag = 'antes' | 'despues' | null

export function getImageTag(url: string): ImageTag {
  if (url.startsWith('__antes__:')) return 'antes'
  if (url.startsWith('__desp__:')) return 'despues'
  return null
}

export function getRealUrl(url: string): string {
  return url.replace(/^__(antes|desp)__:/, '')
}

export function tagUrl(url: string, tag: ImageTag): string {
  const base = getRealUrl(url)
  if (tag === 'antes') return `__antes__:${base}`
  if (tag === 'despues') return `__desp__:${base}`
  return base
}

// ─── Compatibilidad con formato anterior (__sep:) ──────────
export function isSep(url: string): boolean {
  return url.startsWith('__sep:')
}
export function getSepLabel(url: string): string {
  return url.replace('__sep:', '').replace(/__$/, '')
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-PY', {
    year: 'numeric',
    month: 'long',
  })
}

export function getPublicImageUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/proyectos/${path}`
}
