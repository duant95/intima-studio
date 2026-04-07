import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase, type Proyecto } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

interface Props { params: { id: string } }

async function getProyecto(id: string): Promise<Proyecto | null> {
  const { data } = await supabase
    .from('proyectos')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const proyecto = await getProyecto(params.id)
  if (!proyecto) return { title: 'Proyecto no encontrado' }
  return {
    title: proyecto.titulo,
    description: proyecto.descripcion,
  }
}

export default async function ProyectoDetailPage({ params }: Props) {
  const proyecto = await getProyecto(params.id)
  if (!proyecto) notFound()

  return (
    <>
      {/* Back */}
      <div className="pt-32 pb-6 bg-intima-beige">
        <div className="container-site">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 font-body text-sm text-intima-dark/60 hover:text-intima-brown transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            Volver a Proyectos
          </Link>
        </div>
      </div>

      {/* Header del proyecto */}
      <section className="pb-12 bg-intima-beige">
        <div className="container-site">
          <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-3">
            {proyecto.categoria} · {formatDate(proyecto.fecha)}
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-intima-black leading-tight max-w-2xl">
            {proyecto.titulo}
          </h1>
          {proyecto.descripcion && (
            <p className="font-body text-intima-dark/70 text-lg leading-relaxed mt-6 max-w-xl">
              {proyecto.descripcion}
            </p>
          )}
        </div>
      </section>

      {/* Imagen principal */}
      <section className="bg-intima-beige">
        <div className="container-site pb-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={proyecto.imagen_portada}
              alt={proyecto.titulo}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Galería de imágenes adicionales */}
      {proyecto.imagenes && proyecto.imagenes.length > 1 && (
        <section className="py-6 bg-intima-beige">
          <div className="container-site">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proyecto.imagenes.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={img}
                    alt={`${proyecto.titulo} — imagen ${i + 2}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-intima-beige border-t border-intima-sand/40">
        <div className="container-site text-center max-w-lg mx-auto">
          <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-3">
            ¿Te inspiró este proyecto?
          </p>
          <h2 className="font-display text-3xl text-intima-black mb-6">
            Creemos el tuyo
          </h2>
          <Link
            href="/contacto"
            className="inline-block bg-intima-brown text-intima-beige font-body text-sm tracking-widest uppercase px-8 py-4 hover:bg-intima-black transition-colors duration-300"
          >
            Escribinos
          </Link>
        </div>
      </section>
    </>
  )
}
