import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Proyecto } from '@/lib/supabase'
import ProyectoDetalle from '@/components/ProyectoDetalle'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: { id: string }
}

async function getProyecto(id: string): Promise<Proyecto | null> {
  const { data } = await supabase
    .from('proyectos')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

async function getRelacionados(categoria: string, idActual: string): Promise<Proyecto[]> {
  const { data } = await supabase
    .from('proyectos')
    .select('*')
    .eq('categoria', categoria)
    .neq('id', idActual)
    .order('created_at', { ascending: false })
    .limit(3)
  return data ?? []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const proyecto = await getProyecto(params.id)
  if (!proyecto) return { title: 'Proyecto no encontrado' }
  return {
    title: proyecto.titulo,
    description: proyecto.descripcion ?? `Proyecto de diseño de interiores: ${proyecto.titulo}`,
    openGraph: {
      images: proyecto.imagen_portada ? [proyecto.imagen_portada] : [],
    },
  }
}

export default async function ProyectoPage({ params }: Props) {
  const proyecto = await getProyecto(params.id)
  if (!proyecto) notFound()

  const relacionados = await getRelacionados(proyecto.categoria, proyecto.id)

  return (
    <>
      {/* Back nav */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-5 pointer-events-none">
        <div className="container-site">
          <Link
            href="/galeria"
            className="pointer-events-auto inline-flex items-center gap-2 bg-intima-beige/90 backdrop-blur-sm text-intima-dark font-body text-xs tracking-widest uppercase px-4 py-2.5 hover:bg-intima-beige transition-colors mt-16 md:mt-20"
          >
            <ArrowLeft size={13} />
            Volver a proyectos
          </Link>
        </div>
      </div>

      <ProyectoDetalle proyecto={proyecto} relacionados={relacionados} />
    </>
  )
}
