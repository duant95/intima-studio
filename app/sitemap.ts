import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE = 'https://www.intimastudio.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/nosotros`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/galeria`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/servicios`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/taller`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contacto`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
  ]

  const [{ data: proyectos }, { data: paquetes }] = await Promise.all([
    supabase.from('proyectos').select('id, created_at').order('created_at', { ascending: false }),
    supabase.from('paquetes').select('id, created_at').eq('activo', true),
  ])

  const proyectoPages: MetadataRoute.Sitemap = (proyectos ?? []).map((p) => ({
    url: `${BASE}/galeria/${p.id}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const servicioPages: MetadataRoute.Sitemap = (paquetes ?? []).map((p) => ({
    url: `${BASE}/servicios/${p.id}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...proyectoPages, ...servicioPages]
}
