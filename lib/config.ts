import { supabase } from '@/lib/supabase'

export type TallerTipo = {
  imagen_url: string
  nombre: string
  desc: string
}

export type SiteConfig = {
  // WhatsApp
  whatsapp_numero: string
  whatsapp_mensaje: string
  // Imágenes — Inicio
  hero_imagen_url: string
  intro_imagen_url: string
  taller_home_imagen_1: string
  taller_home_imagen_2: string
  taller_home_imagen_3: string
  taller_home_imagen_4: string
  // Imágenes — Otras páginas
  nosotros_imagen_url: string
  og_imagen_url: string
  // Textos — Inicio
  inicio_hero_subtitulo: string
  inicio_hero_titulo: string
  inicio_hero_descripcion: string
  inicio_intro_titulo: string
  inicio_intro_texto: string
  inicio_cta_titulo: string
  inicio_cta_descripcion: string
  // Textos — Nosotros
  nosotros_intro: string
  nosotros_descripcion: string
  nosotros_stat_1_num: string
  nosotros_stat_1_label: string
  nosotros_stat_2_num: string
  nosotros_stat_2_label: string
  // Textos — Contacto
  contacto_email: string
  contacto_instagram: string
  contacto_ubicacion: string
  // El Taller — tipos (JSON string)
  taller_tipos: string
}

export const CONFIG_DEFAULTS: SiteConfig = {
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
  inicio_hero_subtitulo: 'Diseño de Interiores · Asunción, Paraguay',
  inicio_hero_titulo: 'Espacios con alma',
  inicio_hero_descripcion: 'Transformamos ambientes en experiencias únicas, con atención meticulosa al detalle y un diseño que refleja quien sos.',
  inicio_intro_titulo: 'El lujo está en los detalles',
  inicio_intro_texto: 'En Íntima Studio creemos que cada espacio tiene su propia esencia. Trabajamos para descubrirla, potenciarla y traducirla en un diseño que va más allá de lo estético. Nuestro proceso es completamente personalizado. Desde la primera conversación hasta la entrega final, estamos con vos en cada decisión.',
  inicio_cta_titulo: 'Hablemos de tu espacio',
  inicio_cta_descripcion: 'Cada gran proyecto empieza con una conversación. Contanos qué tenés en mente y te responderemos a la brevedad.',
  nosotros_intro: 'Íntima Studio nació de la convicción de que los espacios en los que vivimos y trabajamos nos moldean tanto como nosotros a ellos.',
  nosotros_descripcion: 'Somos un estudio boutique especializado en diseño de interiores residencial y comercial. Creemos en el diseño que surge del diálogo profundo con cada cliente. Cada proyecto es único porque cada persona lo es. No trabajamos con fórmulas prefabricadas: entendemos tu estilo de vida, tus gustos y tus necesidades antes de trazar la primera línea. Nos destacamos por un proceso de diseño transparente, una comunicación constante y un resultado que supera las expectativas.',
  nosotros_stat_1_num: '+50',
  nosotros_stat_1_label: 'Proyectos realizados',
  nosotros_stat_2_num: '5+',
  nosotros_stat_2_label: 'Años de experiencia',
  contacto_email: 'hola@intimastudio.com',
  contacto_instagram: 'intima.studio',
  contacto_ubicacion: 'Asunción, Paraguay',
  taller_tipos: JSON.stringify([
    { imagen_url: '', nombre: 'Mesas & Escritorios', desc: 'Comedor, centro, auxiliares y escritorios de trabajo.' },
    { imagen_url: '', nombre: 'Módulos & Estanterías', desc: 'Bibliotecas, aparadores, módulos de TV y walk-in closets.' },
    { imagen_url: '', nombre: 'Sillas & Sillones', desc: 'Asientos de diseño con tapizados exclusivos.' },
    { imagen_url: '', nombre: 'Camas & Cabeceras', desc: 'Plataformas y cabeceras tapizadas o en madera.' },
    { imagen_url: '', nombre: 'Baños & Vanitorios', desc: 'Muebles de baño a medida con materiales resistentes.' },
    { imagen_url: '', nombre: 'Piezas de exterior', desc: 'Mobiliario para terrazas y espacios al aire libre.' },
  ]),
}

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const { data } = await supabase.from('configuracion').select('clave, valor')
    if (!data) return CONFIG_DEFAULTS
    const config = { ...CONFIG_DEFAULTS }
    for (const row of data) {
      if (row.clave in config) {
        (config as Record<string, string>)[row.clave] = row.valor ?? ''
      }
    }
    return config
  } catch {
    return CONFIG_DEFAULTS
  }
}

export function parseTallerTipos(json: string): TallerTipo[] {
  try {
    const parsed = JSON.parse(json)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
