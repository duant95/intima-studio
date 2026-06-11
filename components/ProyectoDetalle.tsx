'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Calendar, Tag, ExternalLink, Play, MapPin } from 'lucide-react'
import { isVideoUrl, getImageTag, getRealUrl, isSep, getSepLabel } from '@/lib/utils'
import { type Proyecto } from '@/lib/supabase'
import ProjectCard from '@/components/ProjectCard'
import FadeIn from '@/components/FadeIn'

interface Props {
  proyecto: Proyecto
  relacionados: Proyecto[]
}

// Construye la lista de display: inserta divisores cuando cambia la etiqueta
function buildDisplayList(urls: string[]) {
  type Entry =
    | { kind: 'divider'; label: string }
    | { kind: 'image'; url: string; lightboxIdx: number }

  const result: Entry[] = []
  let lastSection: string | null = null
  let imgIdx = 0

  for (const rawUrl of urls) {
    // Formato antiguo: __sep:Label__
    if (isSep(rawUrl)) {
      const label = getSepLabel(rawUrl)
      if (label !== lastSection) { result.push({ kind: 'divider', label }); lastSection = label }
      continue
    }
    // Formato nuevo: __antes__:url / __desp__:url
    const tag = getImageTag(rawUrl)
    const url = getRealUrl(rawUrl)
    const section = tag === 'antes' ? 'Antes' : tag === 'despues' ? 'Después' : null

    if (section !== null && section !== lastSection) {
      result.push({ kind: 'divider', label: section })
      lastSection = section
    } else if (section === null && lastSection !== null && tag === null) {
      lastSection = null
    }

    result.push({ kind: 'image', url, lightboxIdx: imgIdx++ })
  }

  return result
}

export default function ProyectoDetalle({ proyecto, relacionados }: Props) {
  const rawImagenes = proyecto.imagenes?.length ? proyecto.imagenes :
    (proyecto.imagen_portada ? [proyecto.imagen_portada] : [])

  const displayList = buildDisplayList(rawImagenes)
  // Para el lightbox: solo las imágenes reales (URL limpia)
  const imagenes = displayList.filter((e) => e.kind === 'image').map((e) => (e as { kind: 'image'; url: string; lightboxIdx: number }).url)

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const openLightbox = (i: number) => setLightboxIdx(i)
  const closeLightbox = () => setLightboxIdx(null)

  const prev = useCallback(() => {
    if (lightboxIdx === null) return
    setLightboxIdx((lightboxIdx - 1 + imagenes.length) % imagenes.length)
  }, [lightboxIdx, imagenes.length])

  const next = useCallback(() => {
    if (lightboxIdx === null) return
    setLightboxIdx((lightboxIdx + 1) % imagenes.length)
  }, [lightboxIdx, imagenes.length])

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIdx === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIdx, prev, next])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIdx !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxIdx])

  const formatFecha = (fecha?: string) => {
    if (!fecha) return null
    const [year, month] = fecha.split('-')
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
    return `${meses[parseInt(month) - 1]} ${year}`
  }

  return (
    <>
      {/* ─── HERO IMAGE ─────────────────────────────────── */}
      <section className="relative h-[55vh] md:h-[75vh] overflow-hidden bg-intima-sand/30">
        {proyecto.imagen_portada ? (
          isVideoUrl(proyecto.imagen_portada) ? (
            <video
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={proyecto.imagen_portada} />
            </video>
          ) : (
            <Image
              src={proyecto.imagen_portada}
              alt={proyecto.titulo}
              fill
              priority
              className="object-cover"
            />
          )
        ) : (
          <div className="w-full h-full bg-intima-sand/30 flex items-center justify-center">
            <p className="font-body text-xs tracking-widest uppercase text-intima-brown/40">Sin imagen</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-intima-black/60 via-transparent to-transparent" />
        
        {/* Título sobre el hero */}
        <div className="absolute bottom-0 left-0 right-0 pb-10 md:pb-14">
          <div className="container-site">
            <FadeIn direction="up">
              <p className="font-body text-xs tracking-widest uppercase text-intima-sand/70 mb-3">
                {proyecto.categoria}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-6xl text-intima-beige leading-none">
                {proyecto.titulo}
              </h1>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── INFO ───────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-intima-beige">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
            
            {/* Meta */}
            <FadeIn direction="left" className="lg:col-span-1">
              <div className="space-y-6 border-t border-intima-sand pt-6">
                {proyecto.categoria && (
                  <div className="flex items-start gap-3">
                    <Tag size={14} className="text-intima-brown mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-body text-xs tracking-widest uppercase text-intima-dark/40 mb-0.5">Categoría</p>
                      <p className="font-body text-sm text-intima-dark">{proyecto.categoria}</p>
                    </div>
                  </div>
                )}
                {proyecto.ubicacion && (
                  <div className="flex items-start gap-3">
                    <MapPin size={14} className="text-intima-brown mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-body text-xs tracking-widest uppercase text-intima-dark/40 mb-0.5">Ubicación</p>
                      <p className="font-body text-sm text-intima-dark">{proyecto.ubicacion}</p>
                    </div>
                  </div>
                )}
                {proyecto.fecha && (
                  <div className="flex items-start gap-3">
                    <Calendar size={14} className="text-intima-brown mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-body text-xs tracking-widest uppercase text-intima-dark/40 mb-0.5">Fecha</p>
                      <p className="font-body text-sm text-intima-dark">{formatFecha(proyecto.fecha)}</p>
                    </div>
                  </div>
                )}
                <div className="pt-4">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-intima-brown border-b border-intima-brown/40 pb-0.5 hover:border-intima-brown transition-colors"
                  >
                    <ExternalLink size={12} />
                    Quiero un proyecto así
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Descripción */}
            <FadeIn direction="right" className="lg:col-span-2">
              {proyecto.descripcion ? (
                <div className="space-y-4">
                  {proyecto.descripcion.split('\n').filter(Boolean).map((p, i) => (
                    <p key={i} className="font-body text-intima-dark/80 text-base md:text-lg leading-relaxed">{p}</p>
                  ))}
                </div>
              ) : (
                <p className="font-body text-intima-dark/40 italic text-sm">
                  Sin descripción disponible.
                </p>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── GALERÍA ────────────────────────────────────── */}
      {imagenes.length > 0 && (
        <section className="pb-20 bg-intima-beige">
          <div className="container-site">
            <FadeIn>
              <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-8">
                Imágenes del proyecto
              </p>
            </FadeIn>

            <div className={`grid gap-3 md:gap-4 ${
              imagenes.length === 1 ? 'grid-cols-1' :
              imagenes.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {displayList.map((entry, i) =>
                entry.kind === 'divider' ? (
                  <div key={`div-${i}`} className="col-span-full flex items-center gap-4 py-5">
                    <div className="flex-1 h-px bg-intima-sand/60" />
                    <p className="font-body text-xs tracking-widest uppercase text-intima-brown/70 select-none px-2">
                      {entry.label}
                    </p>
                    <div className="flex-1 h-px bg-intima-sand/60" />
                  </div>
                ) : (
                  <FadeIn key={entry.url + i} delay={entry.lightboxIdx * 0.06}>
                    <button
                      onClick={() => openLightbox(entry.lightboxIdx)}
                      className="group relative w-full overflow-hidden bg-intima-sand/20 block"
                      aria-label={`Ver ${isVideoUrl(entry.url) ? 'video' : 'imagen'} ${entry.lightboxIdx + 1}`}
                    >
                      <div className={`relative w-full ${
                        entry.lightboxIdx === 0 && imagenes.length > 3 ? 'aspect-[16/9]' : 'aspect-[4/3]'
                      }`}>
                        {isVideoUrl(entry.url) ? (
                          <>
                            <video src={entry.url} muted loop autoPlay playsInline
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <Play size={28} className="text-white/50" />
                            </div>
                          </>
                        ) : (
                          <Image src={entry.url} alt={`${proyecto.titulo} - ${entry.lightboxIdx + 1}`} fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-intima-black/0 group-hover:bg-intima-black/20 transition-all duration-300 flex items-center justify-center">
                        <span className="font-body text-xs tracking-widest uppercase text-intima-beige opacity-0 group-hover:opacity-100 transition-opacity duration-300">Ver</span>
                      </div>
                    </button>
                  </FadeIn>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── PROYECTOS RELACIONADOS ─────────────────────── */}
      {relacionados.length > 0 && (
        <section className="py-20 bg-intima-black">
          <div className="container-site">
            <FadeIn>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-3">
                    También puede interesarte
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl text-intima-beige">
                    Proyectos relacionados
                  </h2>
                </div>
                <Link
                  href="/galeria"
                  className="hidden md:block font-body text-xs tracking-widest uppercase text-intima-sand/50 hover:text-intima-sand transition-colors border-b border-intima-dark pb-0.5"
                >
                  Ver todos →
                </Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relacionados.map((p, i) => (
                <FadeIn key={p.id} delay={i * 0.1}>
                  <ProjectCard proyecto={p} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── LIGHTBOX ───────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-intima-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Cerrar */}
            <button
              className="absolute top-5 right-5 p-2 text-intima-sand/60 hover:text-intima-sand transition-colors z-10"
              onClick={closeLightbox}
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>

            {/* Contador */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 font-body text-xs tracking-widest text-intima-sand/40">
              {lightboxIdx + 1} / {imagenes.length}
            </div>

            {/* Imagen / Video */}
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full max-w-5xl max-h-[85vh] mx-auto px-14 md:px-20 flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                {isVideoUrl(imagenes[lightboxIdx]) ? (
                  <video
                    src={imagenes[lightboxIdx]}
                    controls autoPlay loop playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={imagenes[lightboxIdx]}
                    alt={`${proyecto.titulo} - imagen ${lightboxIdx + 1}`}
                    fill
                    className="object-contain"
                    quality={90}
                  />
                )}
              </div>
            </motion.div>

            {/* Prev */}
            {imagenes.length > 1 && (
              <>
                <button
                  className="absolute left-3 md:left-5 p-3 text-intima-sand/50 hover:text-intima-sand transition-colors"
                  onClick={(e) => { e.stopPropagation(); prev() }}
                  aria-label="Anterior"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  className="absolute right-3 md:right-5 p-3 text-intima-sand/50 hover:text-intima-sand transition-colors"
                  onClick={(e) => { e.stopPropagation(); next() }}
                  aria-label="Siguiente"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Thumbnails */}
            {imagenes.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {imagenes.map((url, i) => (
                  <button
                    key={url}
                    onClick={(e) => { e.stopPropagation(); setLightboxIdx(i) }}
                    className={`relative w-12 h-8 overflow-hidden bg-intima-dark transition-all duration-200 ${
                      i === lightboxIdx ? 'opacity-100 ring-1 ring-intima-sand' : 'opacity-40 hover:opacity-70'
                    }`}
                    aria-label={`${isVideoUrl(url) ? 'Video' : 'Imagen'} ${i + 1}`}
                  >
                    {isVideoUrl(url)
                      ? <Play size={12} className="text-intima-sand absolute inset-0 m-auto" />
                      : <Image src={url} alt="" fill className="object-cover" />
                    }
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
