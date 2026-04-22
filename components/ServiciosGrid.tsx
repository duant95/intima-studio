'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Paquete } from '@/app/(site)/servicios/page'

interface Props {
  paquetes: Paquete[]
  categorias: string[]
  formatPrecio: (n: number) => string
}

export default function ServiciosGrid({ paquetes, categorias, formatPrecio }: Props) {
  const [activa, setActiva] = useState('Todos')

  const filtrados = activa === 'Todos' ? paquetes : paquetes.filter((p) => p.categoria === activa)

  const waMsg = (nombre: string) =>
    encodeURIComponent(`Hola! Me interesa el paquete *${nombre}*. ¿Me pueden dar más información?`)

  return (
    <section className="py-14 bg-intima-beige">
      <div className="container-site">
        {/* Filtros */}
        <div className="flex gap-5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 mb-10 border-b border-intima-sand/40">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiva(cat)}
              className="relative font-body text-xs tracking-widest uppercase whitespace-nowrap pb-3 transition-colors duration-200"
              style={{ color: activa === cat ? '#5c5449' : '#39393966' }}
            >
              {cat}
              {activa === cat && (
                <motion.div
                  layoutId="servicio-filtro"
                  className="absolute bottom-0 left-0 right-0 h-px bg-intima-brown"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtrados.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="group flex flex-col bg-white border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Imagen */}
                <div className="relative aspect-[4/3] bg-intima-sand/20 overflow-hidden">
                  {p.imagen_url ? (
                    <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-body text-xs tracking-widest uppercase text-intima-brown/30">{p.categoria}</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-intima-beige font-body text-xs tracking-widest uppercase text-intima-brown px-2 py-1">
                      {p.categoria}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-body font-medium text-intima-black text-sm leading-snug mb-2">{p.nombre}</h3>
                  {p.descripcion && (
                    <p className="font-body text-xs text-intima-dark/60 leading-relaxed mb-3 line-clamp-2">{p.descripcion}</p>
                  )}
                  {p.incluye?.length > 0 && (
                    <ul className="mb-4 space-y-1 flex-1">
                      {p.incluye.map((item, idx) => (
                        <li key={idx} className="font-body text-xs text-intima-dark/70 flex items-start gap-1.5">
                          <span className="text-intima-brown mt-0.5 flex-shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="border-t border-gray-100 pt-4 mt-auto">
                    {p.precio && (
                      <p className="font-display text-xl text-intima-black mb-3">{formatPrecio(p.precio)}</p>
                    )}
                    <a
                      href={`https://wa.me/595981132221?text=${waMsg(p.nombre)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center bg-intima-brown text-intima-beige font-body text-xs tracking-widest uppercase px-4 py-3 hover:bg-intima-black transition-colors duration-300"
                    >
                      Consultar por WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
