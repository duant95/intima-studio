import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { getSiteConfig } from '@/lib/config'
import FadeIn from '@/components/FadeIn'
import type { Paquete } from '@/app/(site)/servicios/page'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getPaquete(id: string): Promise<Paquete | null> {
  const { data } = await supabase
    .from('paquetes')
    .select('*')
    .eq('id', id)
    .eq('activo', true)
    .single()
  return data as Paquete | null
}

async function getRelacionados(id: string, categoria: string): Promise<Paquete[]> {
  const { data } = await supabase
    .from('paquetes')
    .select('*')
    .eq('activo', true)
    .eq('categoria', categoria)
    .neq('id', id)
    .limit(3)
  return (data ?? []) as Paquete[]
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const paquete = await getPaquete(params.id)
  if (!paquete) return { title: 'Servicio no encontrado' }
  return {
    title: paquete.nombre,
    description: paquete.descripcion ?? `Paquete de diseño de interiores: ${paquete.nombre}`,
  }
}

const formatPrecio = (precio: number) =>
  new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(precio)

export default async function ServicioDetallePage({ params }: { params: { id: string } }) {
  const [paquete, config] = await Promise.all([getPaquete(params.id), getSiteConfig()])

  if (!paquete) notFound()

  const relacionados = await getRelacionados(params.id, paquete.categoria)

  const waMsg = encodeURIComponent(
    `Hola! Me interesa el paquete *${paquete.nombre}*. ¿Me pueden dar más información?`
  )
  const waUrl = `https://wa.me/${config.whatsapp_numero}?text=${waMsg}`

  const proceso = paquete.proceso ?? []

  return (
    <>
      {/* ─── HEADER / HERO ─────────────────────────────────── */}
      <section className="pt-24 md:pt-32 bg-intima-beige">
        <div className="container-site">

          {/* Volver */}
          <FadeIn>
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-intima-dark/50 hover:text-intima-brown transition-colors mb-10"
            >
              <ArrowLeft size={13} />
              Todos los servicios
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start pb-20">

            {/* Imagen */}
            <FadeIn direction="left">
              <div className="relative aspect-[4/3] bg-intima-sand/30 overflow-hidden">
                {paquete.imagen_url ? (
                  <Image
                    src={paquete.imagen_url}
                    alt={paquete.nombre}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-body text-xs tracking-widest uppercase text-intima-brown/30">
                      {paquete.categoria}
                    </span>
                  </div>
                )}
                {/* Badge categoría */}
                <div className="absolute top-4 left-4">
                  <span className="bg-intima-beige font-body text-xs tracking-widest uppercase text-intima-brown px-3 py-1.5">
                    {paquete.categoria}
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Info */}
            <FadeIn direction="right" delay={0.1}>
              <div className="lg:pt-4">
                <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">
                  Diseño online · Precio fijo
                </p>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-intima-black leading-tight mb-6">
                  {paquete.nombre}
                </h1>

                {paquete.descripcion && (
                  <p className="font-body text-intima-dark/70 leading-relaxed mb-8 text-base">
                    {paquete.descripcion}
                  </p>
                )}

                {/* Qué incluye */}
                {paquete.incluye?.length > 0 && (
                  <div className="mb-8">
                    <p className="font-body text-xs tracking-widest uppercase text-intima-dark/40 mb-4">
                      Qué incluye
                    </p>
                    <ul className="space-y-2.5">
                      {paquete.incluye.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 font-body text-sm text-intima-dark/80">
                          <span className="text-intima-brown font-medium mt-0.5 flex-shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Precio + CTA */}
                <div className="border-t border-intima-sand/60 pt-8">
                  {paquete.precio && (
                    <div className="mb-6">
                      <p className="font-body text-xs tracking-widest uppercase text-intima-dark/40 mb-1">
                        Inversión
                      </p>
                      <p className="font-display text-4xl text-intima-black">
                        {formatPrecio(paquete.precio)}
                      </p>
                    </div>
                  )}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-intima-brown text-intima-beige font-body text-xs tracking-widest uppercase px-8 py-4 hover:bg-intima-black transition-colors duration-300 w-full sm:w-auto justify-center"
                  >
                    {/* WhatsApp icon */}
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Consultar por WhatsApp
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── PROCESO ───────────────────────────────────────── */}
      {proceso.length > 0 && (
        <section className="py-20 md:py-28 bg-intima-black text-intima-beige">
          <div className="container-site">
            <FadeIn>
              <div className="mb-14">
                <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">
                  Cómo funciona
                </p>
                <h2 className="font-display text-3xl md:text-4xl">
                  El proceso
                </h2>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
              {proceso.map(({ num, titulo, desc }, i) => (
                <FadeIn key={num} delay={i * 0.1}>
                  <div className="border-t border-intima-dark pt-6 pb-8 pr-8">
                    <p className="font-display text-intima-brown/40 text-5xl mb-5 leading-none">{num}</p>
                    <h3 className="font-body text-intima-sand font-medium text-base mb-3">{titulo}</h3>
                    <p className="font-body text-intima-sand/50 text-sm leading-relaxed">{desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── RELACIONADOS ──────────────────────────────────── */}
      {relacionados.length > 0 && (
        <section className="py-20 bg-intima-beige section-divider">
          <div className="container-site">
            <FadeIn>
              <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-10">
                También te puede interesar
              </p>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relacionados.map((p, i) => (
                <FadeIn key={p.id} delay={i * 0.08}>
                  <Link
                    href={`/servicios/${p.id}`}
                    className="group flex flex-col bg-white border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] bg-intima-sand/20 overflow-hidden">
                      {p.imagen_url ? (
                        <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-body text-xs text-intima-brown/30 tracking-widest uppercase">{p.categoria}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-body font-medium text-intima-black text-sm mb-1">{p.nombre}</h3>
                      {p.precio && (
                        <p className="font-display text-lg text-intima-brown mt-auto pt-3">{formatPrecio(p.precio)}</p>
                      )}
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section className="py-20 bg-intima-black text-intima-beige">
        <div className="container-site max-w-2xl mx-auto text-center">
          <FadeIn>
            <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">
              ¿No encontrás lo que buscás?
            </p>
            <h2 className="font-display text-3xl md:text-4xl mb-6">
              Diseñamos a medida
            </h2>
            <p className="font-body text-intima-sand/70 leading-relaxed mb-10">
              Si tu proyecto necesita algo más específico, hablemos. Armamos una propuesta personalizada para vos.
            </p>
            <Link
              href="/contacto"
              className="inline-block bg-intima-brown text-intima-beige font-body text-xs tracking-widest uppercase px-10 py-4 hover:bg-intima-beige hover:text-intima-black transition-colors duration-300"
            >
              Consultar proyecto personalizado
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
