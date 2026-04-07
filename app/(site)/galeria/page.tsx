import { Metadata } from 'next'
import { supabase, type Proyecto } from '@/lib/supabase'
import GaleriaFiltrada from '@/components/GaleriaFiltrada'

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Galería de proyectos de diseño de interiores de Íntima Studio.',
}

const CATEGORIAS = ['Todos', 'Residencial', 'Comercial', 'Oficinas', 'Hospitalidad']

async function getProyectos(): Promise<Proyecto[]> {
  const { data } = await supabase
    .from('proyectos')
    .select('*')
    .order('orden', { ascending: true })
  return data ?? []
}

export default async function GaleriaPage() {
  const proyectos = await getProyectos()

  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-12 bg-intima-beige">
        <div className="container-site">
          <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">
            Portafolio
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-intima-black leading-none">
            Proyectos
          </h1>
        </div>
      </section>

      {/* Filtros interactivos + grid animado */}
      <GaleriaFiltrada proyectos={proyectos} categorias={CATEGORIAS} />
    </>
  )
}
