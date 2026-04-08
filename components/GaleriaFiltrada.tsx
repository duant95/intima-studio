'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import { type Proyecto } from '@/lib/supabase'

interface Props {
  proyectos: Proyecto[]
  categorias: string[]
}

export default function GaleriaFiltrada({ proyectos, categorias }: Props) {
  const [activa, setActiva] = useState('Todos')

  const filtrados = activa === 'Todos'
    ? proyectos
    : proyectos.filter((p) => p.categoria === activa)

  return (
    <>
      {/* Filtros */}
      <section className="bg-intima-beige border-b border-intima-sand/40 sticky top-[56px] md:top-[72px] z-30 backdrop-blur-sm bg-intima-beige/95">
        <div className="container-site py-4">
          <div className="flex gap-5 md:gap-6 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiva(cat)}
                className="relative font-body text-xs tracking-widest uppercase whitespace-nowrap transition-colors duration-200 pb-1 py-1"
                style={{ color: activa === cat ? '#5c5449' : '#393939aa' }}
              >
                {cat}
                {/* Indicador activo animado */}
                {activa === cat && (
                  <motion.div
                    layoutId="filtro-activo"
                    className="absolute bottom-0 left-0 right-0 h-px bg-intima-brown"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contador */}
      <div className="container-site pt-8 pb-2">
        <motion.p
          key={activa}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-body text-xs text-intima-dark/40 tracking-widest uppercase"
        >
          {filtrados.length} proyecto{filtrados.length !== 1 ? 's' : ''}
          {activa !== 'Todos' && ` · ${activa}`}
        </motion.p>
      </div>

      {/* Grid con animaciones */}
      <section className="pb-24 bg-intima-beige">
        <div className="container-site">
          {filtrados.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="font-body text-intima-dark/40">
                No hay proyectos en esta categoría aún.
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14"
            >
              <AnimatePresence mode="popLayout">
                {filtrados.map((proyecto, i) => (
                  <motion.div
                    key={proyecto.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                  >
                    <ProjectCard proyecto={proyecto} priority={i < 4} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
