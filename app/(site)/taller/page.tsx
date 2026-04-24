import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { supabase, type Proyecto } from '@/lib/supabase'
import { getSiteConfig, parseTallerTipos } from '@/lib/config'
import ProjectCard from '@/components/ProjectCard'
import FadeIn from '@/components/FadeIn'
import CRMebleLogo from '@/components/CRMebleLogo'
import { ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'El Taller · Muebles a Medida',
  description: 'Diseño y fabricación de muebles únicos a medida. Piezas de autor que transforman cada espacio.',
}

const CATEGORIAS_TALLER = ['Mobiliario', 'Muebles']

const VALORES = [
  { num: '01', titulo: 'Diseño de autor', desc: 'Cada pieza nace de un proceso creativo único, pensada para el espacio y quien lo habita.' },
  { num: '02', titulo: 'Materiales nobles', desc: 'Madera maciza, metal, vidrio y tapizados de calidad. Seleccionamos cada material con criterio.' },
  { num: '03', titulo: 'Fabricación local', desc: 'Todo se produce en nuestro taller en Asunción. Control total sobre cada etapa del proceso.' },
  { num: '04', titulo: 'A tu medida', desc: 'Las dimensiones, terminaciones y detalles se adaptan a tu espacio y tu visión exactos.' },
]

async function getMuebles(): Promise<Proyecto[]> {
  const { data } = await supabase
    .from('proyectos')
    .select('*')
    .in('categoria', CATEGORIAS_TALLER)
    .order('created_at', { ascending: false })
    .limit(6)
  return data ?? []
}

export default async function TallerPage() {
  const [muebles, config] = await Promise.all([getMuebles(), getSiteConfig()])
  const tipos = parseTallerTipos(config.taller_tipos)

  return (
    <>
      {/* ─── HERO ───────────────────────────────────────── */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-end pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-intima-black" />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 60px, #e9e1dc 60px, #e9e1dc 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, #e9e1dc 60px, #e9e1dc 61px)',
          }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-intima-brown/10" />

        {/* CR Mueble logo — posicionado debajo del navbar, separado */}
        <div className="absolute top-24 md:top-28 left-0 right-0 z-10 pointer-events-none">
          <div className="container-site">
            <FadeIn delay={0.05}>
              <CRMebleLogo color="#a08882" size="md" />
            </FadeIn>
          </div>
        </div>

        {/* Contenido principal — abajo */}
        <div className="relative container-site w-full z-10">
          <div className="max-w-2xl">
            <FadeIn delay={0.15}>
              <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-5">
                Íntima Studio · Fabricación propia
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <h1 className="font-display text-5xl sm:text-6xl md:text-8xl text-intima-beige leading-none mb-6">
                <span className="italic text-intima-sand">El Taller</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="font-body text-intima-sand/70 text-base md:text-lg max-w-md leading-relaxed mb-10">
                Diseñamos y fabricamos muebles únicos a medida. Piezas de autor que no encontrás en ningún catálogo.
              </p>
            </FadeIn>
            <FadeIn delay={0.55}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 bg-intima-beige text-intima-black font-body text-xs tracking-widest uppercase px-7 py-4 hover:bg-intima-sand transition-colors duration-300"
                >
                  Cotizá tu mueble
                  <ArrowRight size={13} />
                </Link>
                <a
                  href="https://instagram.com/crmeble"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-intima-sand/30 text-intima-sand font-body text-xs tracking-widest uppercase px-7 py-4 hover:border-intima-sand transition-all duration-300"
                >
                  Ver en Instagram
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── CONCEPTO ───────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-intima-beige">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
            <FadeIn direction="left">
              <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-5">
                Nuestra filosofía
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-intima-black leading-tight mb-6">
                El mueble como<br />
                <span className="italic">obra de diseño</span>
              </h2>
              <div className="font-body text-intima-dark/75 leading-relaxed space-y-4">
                <p>En el Taller creemos que el mobiliario es la columna vertebral de un espacio. Un mueble bien diseñado no solo cumple una función — define la identidad del lugar.</p>
                <p>Cada pieza que fabricamos comienza con un boceto pensado en conjunto con el cliente. Las medidas, los materiales y los detalles constructivos responden a un espacio concreto y a quien lo usa.</p>
                <p>Trabajamos con madera maciza, chapa, metal, vidrio y tapizados de alta calidad. Sin atajos, sin producción en serie.</p>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-intima-sand/30 p-6 md:p-8">
                  <p className="font-display text-4xl md:text-5xl text-intima-brown mb-2">100%</p>
                  <p className="font-body text-sm text-intima-dark/60">Fabricación local en Asunción</p>
                </div>
                <div className="bg-intima-black p-6 md:p-8">
                  <p className="font-display text-4xl md:text-5xl text-intima-sand mb-2">A medida</p>
                  <p className="font-body text-sm text-intima-sand/50">Cada pieza es única y exclusiva</p>
                </div>
                <div className="bg-intima-brown/10 p-6 md:p-8">
                  <p className="font-display text-4xl md:text-5xl text-intima-black mb-2">+80</p>
                  <p className="font-body text-sm text-intima-dark/60">Piezas diseñadas y fabricadas</p>
                </div>
                <div className="border border-intima-sand p-6 md:p-8">
                  <p className="font-display text-4xl md:text-5xl text-intima-brown mb-2">2+</p>
                  <p className="font-body text-sm text-intima-dark/60">Años de taller propio</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── QUÉ FABRICAMOS — con imágenes desde config ─── */}
      <section className="py-20 bg-intima-black text-intima-beige">
        <div className="container-site">
          <FadeIn>
            <div className="mb-12">
              <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">
                Qué fabricamos
              </p>
              <h2 className="font-display text-4xl md:text-5xl">
                Tipos de piezas
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tipos.map(({ imagen_url, nombre, desc }, i) => (
              <FadeIn key={nombre} delay={i * 0.08}>
                <div className="group bg-intima-dark/20 hover:bg-intima-brown/10 transition-colors duration-300 overflow-hidden">
                  {/* Imagen */}
                  <div className="relative aspect-[4/3] bg-intima-dark/40 overflow-hidden">
                    {imagen_url ? (
                      <Image
                        src={imagen_url}
                        alt={nombre}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-4xl text-intima-brown/20">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-6">
                    <h3 className="font-body font-medium text-intima-sand text-base mb-2">{nombre}</h3>
                    <p className="font-body text-sm text-intima-sand/50 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESO ────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-intima-beige">
        <div className="container-site">
          <FadeIn>
            <div className="mb-14">
              <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">Cómo trabajamos</p>
              <h2 className="font-display text-4xl md:text-5xl text-intima-black">Del boceto al mueble</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALORES.map(({ num, titulo, desc }, i) => (
              <FadeIn key={num} delay={i * 0.1}>
                <div className="border-t border-intima-sand pt-6">
                  <p className="font-display text-intima-brown/40 text-5xl mb-4">{num}</p>
                  <h3 className="font-body text-intima-black font-medium text-base mb-3">{titulo}</h3>
                  <p className="font-body text-intima-dark/60 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALERÍA DE PIEZAS ──────────────────────────── */}
      {muebles.length > 0 && (
        <section className="py-20 bg-intima-beige section-divider">
          <div className="container-site">
            <FadeIn>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-3">Portafolio</p>
                  <h2 className="font-display text-4xl md:text-5xl text-intima-black">Piezas recientes</h2>
                </div>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {muebles.map((m, i) => (
                <FadeIn key={m.id} delay={i * 0.1}>
                  <ProjectCard proyecto={m} priority={i < 3} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-intima-brown">
        <div className="container-site max-w-2xl mx-auto text-center">
          <FadeIn>
            <p className="font-body text-xs tracking-widest uppercase text-intima-beige/60 mb-5">¿Tenés una pieza en mente?</p>
            <h2 className="font-display text-4xl md:text-5xl text-intima-beige mb-6 leading-tight">Diseñémosla juntos</h2>
            <p className="font-body text-intima-beige/70 leading-relaxed mb-10">
              Contanos el espacio, las medidas aproximadas y el estilo que buscás. Te respondemos con una propuesta inicial sin costo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contacto" className="inline-block text-center bg-intima-beige text-intima-brown font-body text-xs tracking-widest uppercase px-10 py-4 hover:bg-intima-black hover:text-intima-beige transition-colors duration-300">
                Contactanos
              </Link>
              <a href="https://instagram.com/crmeble" target="_blank" rel="noopener noreferrer"
                className="inline-block text-center border border-intima-beige/40 text-intima-beige font-body text-xs tracking-widest uppercase px-10 py-4 hover:border-intima-beige transition-all duration-300">
                @crmeble en Instagram
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
