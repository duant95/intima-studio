import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { getSiteConfig } from '@/lib/config'
import ServiciosGrid from '@/components/ServiciosGrid'
import FadeIn from '@/components/FadeIn'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Servicios · Comprá tu proyecto',
  description: 'Paquetes de diseño de interiores online. Proyectos 3D, planos y lista de compras con precios fijos.',
}

export type ProcesoStep = {
  num: string
  titulo: string
  desc: string
}

export type Paquete = {
  id: string
  nombre: string
  descripcion: string | null
  precio: number | null
  imagen_url: string | null
  incluye: string[]
  proceso: ProcesoStep[]
  categoria: string
  destacado: boolean
  orden: number
}

async function getPaquetes() {
  const { data } = await supabase
    .from('paquetes')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true })
  return (data ?? []) as Paquete[]
}

const formatPrecio = (precio: number) =>
  new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(precio)

export default async function ServiciosPage() {
  const [paquetes, config] = await Promise.all([getPaquetes(), getSiteConfig()])
  const destacados = paquetes.filter((p) => p.destacado)
  const categorias = ['Todos', ...Array.from(new Set(paquetes.map((p) => p.categoria)))]

  return (
    <>
      {/* Header */}
      <section className="pt-28 md:pt-40 pb-10 md:pb-14 bg-intima-beige">
        <div className="container-site">
          <FadeIn>
            <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">
              Diseño online · Precios fijos
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-intima-black leading-none mb-6">
              Comprá tu<br />
              <span className="italic">proyecto</span>
            </h1>
            <p className="font-body text-intima-dark/70 text-base md:text-lg max-w-xl leading-relaxed">
              Paquetes de diseño de interiores online con precio fijo. Recibís el proyecto 3D, planos y todo lo que necesitás para transformar tu espacio.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Destacados */}
      {destacados.length > 0 && (
        <section className="pb-6 bg-intima-beige">
          <div className="container-site">
            <FadeIn>
              <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-8">Destacados</p>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {destacados.map((p, i) => (
                <FadeIn key={p.id} delay={i * 0.08}>
                  <PaqueteCard paquete={p} formatPrecio={formatPrecio} destacado waNumero={config.whatsapp_numero} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Todos los paquetes con filtro */}
      <ServiciosGrid paquetes={paquetes} categorias={categorias} />

      {/* CTA personalizado */}
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

// Card component — destacados (la grid usa ServiciosGrid que ya linkea a /servicios/[id])
function PaqueteCard({ paquete, formatPrecio, destacado, waNumero }: {
  paquete: Paquete
  formatPrecio: (n: number) => string
  destacado?: boolean
  waNumero: string
}) {
  const waMsg = encodeURIComponent(
    `Hola! Me interesa el paquete *${paquete.nombre}*. ¿Me pueden dar más información?`
  )
  const waUrl = `https://wa.me/${waNumero}?text=${waMsg}`

  return (
    <div className={`group flex flex-col bg-white border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${destacado ? 'border-intima-sand' : 'border-gray-100'}`}>
      <div className="relative aspect-[4/3] bg-intima-sand/20 overflow-hidden">
        {paquete.imagen_url ? (
          <img src={paquete.imagen_url} alt={paquete.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-body text-xs tracking-widest uppercase text-intima-brown/30">{paquete.categoria}</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-intima-beige font-body text-xs tracking-widest uppercase text-intima-brown px-2 py-1">
            {paquete.categoria}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-body font-medium text-intima-black text-sm leading-snug mb-2 flex-1">
          {paquete.nombre}
        </h3>
        {paquete.descripcion && (
          <p className="font-body text-xs text-intima-dark/60 leading-relaxed mb-3 line-clamp-2">
            {paquete.descripcion}
          </p>
        )}
        {paquete.incluye?.length > 0 && (
          <ul className="mb-4 space-y-1">
            {paquete.incluye.map((item, i) => (
              <li key={i} className="font-body text-xs text-intima-dark/70 flex items-start gap-1.5">
                <span className="text-intima-brown mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-gray-100 pt-4 mt-auto">
          {paquete.precio && (
            <p className="font-display text-xl text-intima-black mb-3">
              {formatPrecio(paquete.precio)}
            </p>
          )}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-intima-brown text-intima-beige font-body text-xs tracking-widest uppercase px-4 py-3 hover:bg-intima-black transition-colors duration-300"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
