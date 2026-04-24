import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteConfig } from '@/lib/config'
import FadeIn from '@/components/FadeIn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conocé el equipo y la filosofía de Íntima Studio.',
}

const PROCESO = [
  { num: '01', titulo: 'Consulta inicial', desc: 'Nos reunimos para entender tu visión, necesidades y el espacio con el que vamos a trabajar.' },
  { num: '02', titulo: 'Concepto & Propuesta', desc: 'Desarrollamos una propuesta de diseño conceptual con planos, paleta de materiales y referencias visuales.' },
  { num: '03', titulo: 'Desarrollo del proyecto', desc: 'Refinamos cada detalle: iluminación, mobiliario, acabados. Todo con tu aprobación en cada etapa.' },
  { num: '04', titulo: 'Ejecución & Entrega', desc: 'Coordinamos la obra, proveedores y supervisamos cada instalación hasta la entrega final.' },
]

export default async function NosotrosPage() {
  const config = await getSiteConfig()

  return (
    <>
      {/* Header */}
      <section className="pt-28 md:pt-40 pb-14 md:pb-20 bg-intima-beige">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-end">
            <FadeIn direction="left">
              <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">
                Sobre nosotros
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-intima-black leading-none">
                El diseño como<br />
                <span className="italic">conversación</span>
              </h1>
            </FadeIn>
            <FadeIn direction="right" delay={0.1}>
              <p className="font-body text-intima-dark/80 text-base md:text-lg leading-relaxed">
                {config.nosotros_intro}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Imagen y descripción */}
      <section className="bg-intima-beige">
        <div className="container-site pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <FadeIn direction="left" className="lg:col-span-3">
              <div className="relative aspect-[4/3] sm:aspect-[3/4] overflow-hidden bg-intima-sand/40 flex items-center justify-center">
                {config.nosotros_imagen_url ? (
                  <Image
                    src={config.nosotros_imagen_url}
                    alt="El equipo de Íntima Studio"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <p className="font-body text-xs tracking-widest uppercase text-intima-brown/30">
                    Foto del equipo
                  </p>
                )}
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.1} className="lg:col-span-2">
              <div className="pt-6 lg:pt-12">
                <h2 className="font-display text-3xl text-intima-black mb-6 leading-tight">
                  Sofisticación, vanguardia y atención al cliente
                </h2>
                <div className="font-body text-intima-dark/75 leading-relaxed space-y-4">
                  {config.nosotros_descripcion.split('\n').filter(Boolean).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <div className="mt-10 pt-10 border-t border-intima-sand/60">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="font-display text-4xl text-intima-brown">{config.nosotros_stat_1_num}</p>
                      <p className="font-body text-sm text-intima-dark/60 mt-1">{config.nosotros_stat_1_label}</p>
                    </div>
                    <div>
                      <p className="font-display text-4xl text-intima-brown">{config.nosotros_stat_2_num}</p>
                      <p className="font-body text-sm text-intima-dark/60 mt-1">{config.nosotros_stat_2_label}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Nuestro proceso */}
      <section className="py-24 bg-intima-black text-intima-beige">
        <div className="container-site">
          <FadeIn>
            <div className="mb-16">
              <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">Cómo trabajamos</p>
              <h2 className="font-display text-4xl md:text-5xl">Nuestro proceso</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {PROCESO.map(({ num, titulo, desc }, i) => (
              <FadeIn key={num} delay={i * 0.1}>
                <div className="border-t border-intima-dark pt-6">
                  <p className="font-display text-intima-brown/60 text-5xl mb-4">{num}</p>
                  <h3 className="font-body text-intima-sand font-medium text-lg mb-3">{titulo}</h3>
                  <p className="font-body text-intima-sand/50 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-intima-beige">
        <div className="container-site max-w-xl mx-auto text-center">
          <FadeIn>
            <h2 className="font-display text-4xl text-intima-black mb-6">¿Empezamos?</h2>
            <p className="font-body text-intima-dark/70 leading-relaxed mb-10">
              Contanos sobre tu proyecto y agendamos una consulta inicial sin cargo.
            </p>
            <Link
              href="/contacto"
              className="inline-block bg-intima-brown text-intima-beige font-body text-sm tracking-widest uppercase px-10 py-4 hover:bg-intima-black transition-colors duration-300"
            >
              Contactanos
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
