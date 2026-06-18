import { Metadata } from 'next'
import { supabase, type Proyecto } from '@/lib/supabase'
import GaleriaFiltrada from '@/components/GaleriaFiltrada'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Galería de Proyectos · Diseño de Interiores',
  description:
    'Galería de proyectos realizados por Íntima Studio: remodelaciones residenciales, diseño comercial, dormitorios, cocinas, livings y más en Asunción, Paraguay.',
  openGraph: {
    title: 'Galería de Proyectos · Íntima Studio',
    description: 'Proyectos de diseño de interiores residencial y comercial en Paraguay.',
  },
}

// Categorías que pertenecen a El Taller (no galería de diseño)
const CATEGORIAS_TALLER = ['Mobiliario', 'Muebles']

async function getProyectos(): Promise<Proyecto[]> {
  const { data } = await supabase
    .from('proyectos')
    .select('*')
    .not('categoria', 'in', `(${CATEGORIAS_TALLER.join(',')})`)
    .order('orden', { ascending: true })
  return data ?? []
}

export default async function GaleriaPage() {
  const proyectos = await getProyectos()

  // Categorías dinámicas desde los proyectos reales
  const categoriasUnicas = Array.from(new Set(proyectos.map((p) => p.categoria))).filter(Boolean)
  const categorias = ['Todos', ...categoriasUnicas]

  return (
    <>
      {/* Header */}
      <section className="pt-28 md:pt-40 pb-10 md:pb-12 bg-intima-beige">
        <div className="container-site">
          <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">
            Portafolio
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-intima-black leading-none">
            Proyectos
          </h1>
        </div>
      </section>

      {/* Filtros interactivos + grid animado */}
      <GaleriaFiltrada proyectos={proyectos} categorias={categorias} />
    </>
  )
}
