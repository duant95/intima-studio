import Link from 'next/link'
import { supabase, type Proyecto } from '@/lib/supabase'
import ProjectCard from '@/components/ProjectCard'
import FadeIn from '@/components/FadeIn'

// Forzar que la página siempre traiga datos frescos de Supabase
export const dynamic = 'force-dynamic'

async function getProyectosDestacados(): Promise<Proyecto[]> {
  // Primero intentar con destacados
  const { data: destacados } = await supabase
    .from('proyectos')
    .select('*')
    .eq('destacado', true)
    .order('orden', { ascending: true })
    .limit(6)

  if (destacados && destacados.length > 0) return destacados

  // Si no hay destacados, mostrar los más recientes
  const { data: recientes } = await supabase
    .from('proyectos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)

  return recientes ?? []
}

export default async function HomePage() {
  const proyectosDestacados = await getProyectosDestacados()

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end pb-16 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-intima-brown">
          <div className="absolute inset-0 bg-gradient-to-t from-intima-black/80 via-intima-black/30 to-intima-black/10" />
        </div>
        <div className="relative container-site w-full">
          <div className="max-w-2xl">
            <FadeIn delay={0.1}>
              <p className="font-body text-intima-sand/70 text-xs tracking-widest uppercase mb-5 md:mb-6">
                Diseño de Interiores · Asunción, Paraguay
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <h1 className="font-display text-intima-beige text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-none mb-6 md:mb-8">
                Espacios<br />
                <span className="text-intima-sand italic">con alma</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="font-body text-intima-sand/80 text-base md:text-lg max-w-md leading-relaxed mb-8 md:mb-10">
                Transformamos ambientes en experiencias únicas, con atención meticulosa al detalle y un diseño que refleja quien sos.
              </p>
            </FadeIn>
            <FadeIn delay={0.55}>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link
                  href="/galeria"
                  className="inline-block text-center bg-intima-beige text-intima-black font-body text-xs tracking-widest uppercase px-7 py-4 hover:bg-intima-sand transition-colors duration-300"
                >
                  Ver Proyectos
                </Link>
                <Link
                  href="/contacto"
                  className="inline-block text-center border border-intima-sand/40 text-intima-sand font-body text-xs tracking-widest uppercase px-7 py-4 hover:border-intima-sand hover:text-intima-beige transition-all duration-300"
                >
                  Contactanos
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── INTRO ────────────────────────────────────────────── */}
      <section className="py-24 bg-intima-beige">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <FadeIn direction="left">
                <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">
                  Nuestro enfoque
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-intima-black leading-tight mb-6">
                  El lujo está en los detalles
                </h2>
              </FadeIn>
              <FadeIn delay={0.15} direction="left">
                <p className="font-body text-intima-dark/80 leading-relaxed mb-4">
                  En Íntima Studio creemos que cada espacio tiene su propia esencia. Trabajamos para descubrirla, potenciarla y traducirla en un diseño que va más allá de lo estético.
                </p>
                <p className="font-body text-intima-dark/70 leading-relaxed mb-8">
                  Nuestro proceso es completamente personalizado. Desde la primera conversación hasta la entrega final, estamos con vos en cada decisión.
                </p>
                <Link
                  href="/nosotros"
                  className="font-body text-sm tracking-widest uppercase text-intima-brown border-b border-intima-brown/40 pb-0.5 hover:border-intima-brown transition-colors duration-200"
                >
                  Conocé más sobre nosotros →
                </Link>
              </FadeIn>
            </div>
            <FadeIn direction="right">
              <div className="relative aspect-[4/5] bg-intima-sand/40 flex items-center justify-center">
                <p className="font-body text-xs tracking-widest uppercase text-intima-brown/40">
                  Imagen del estudio
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── PROYECTOS DESTACADOS ─────────────────────────────── */}
      {proyectosDestacados.length > 0 && (
        <section className="py-24 bg-intima-beige section-divider">
          <div className="container-site">
            <FadeIn>
              <div className="flex items-end justify-between mb-14">
                <div>
                  <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-3">
                    Portafolio
                  </p>
                  <h2 className="font-display text-4xl md:text-5xl text-intima-black">
                    Proyectos<br />recientes
                  </h2>
                </div>
                <Link
                  href="/galeria"
                  className="hidden md:block font-body text-sm tracking-widest uppercase text-intima-dark hover:text-intima-brown transition-colors duration-200 border-b border-intima-sand pb-0.5"
                >
                  Ver todos →
                </Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {proyectosDestacados.map((proyecto, i) => (
                <FadeIn key={proyecto.id} delay={i * 0.1}>
                  <ProjectCard proyecto={proyecto} priority={i < 3} />
                </FadeIn>
              ))}
            </div>
            <div className="mt-10 text-center md:hidden">
              <Link
                href="/galeria"
                className="font-body text-sm tracking-widest uppercase text-intima-brown border-b border-intima-brown/40 pb-0.5"
              >
                Ver todos los proyectos →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── VALORES ──────────────────────────────────────────── */}
      <section className="py-24 bg-intima-black text-intima-beige">
        <div className="container-site">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl">Lo que nos define</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { valor: 'Calidad',     desc: 'Materiales y procesos de la más alta exigencia.' },
              { valor: 'Innovación',  desc: 'Soluciones creativas que desafían lo convencional.' },
              { valor: 'Audacia',     desc: 'Diseños que se atreven a ser diferentes.' },
              { valor: 'Experiencia', desc: 'Años transformando espacios en experiencias.' },
            ].map(({ valor, desc }, i) => (
              <FadeIn key={valor} delay={i * 0.1}>
                <div className="text-center">
                  <p className="font-display text-2xl md:text-3xl text-intima-sand mb-3">{valor}</p>
                  <p className="font-body text-sm text-intima-sand/50 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA CONTACTO ─────────────────────────────────────── */}
      <section className="py-24 bg-intima-beige">
        <div className="container-site max-w-2xl mx-auto text-center">
          <FadeIn>
            <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">
              ¿Tenés un proyecto en mente?
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-intima-black mb-6 leading-tight">
              Hablemos de tu espacio
            </h2>
            <p className="font-body text-intima-dark/70 leading-relaxed mb-10">
              Cada gran proyecto empieza con una conversación. Contanos qué tenés en mente y te responderemos a la brevedad.
            </p>
            <Link
              href="/contacto"
              className="inline-block bg-intima-brown text-intima-beige font-body text-sm tracking-widest uppercase px-10 py-4 hover:bg-intima-black transition-colors duration-300"
            >
              Iniciá tu proyecto
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
