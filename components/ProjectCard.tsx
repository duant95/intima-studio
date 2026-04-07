'use client'

import Image from 'next/image'
import Link from 'next/link'
import { type Proyecto } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  proyecto: Proyecto
  className?: string
  priority?: boolean
}

export default function ProjectCard({ proyecto, className, priority = false }: ProjectCardProps) {
  return (
    <Link
      href={`/galeria/${proyecto.id}`}
      className={cn(
        'group block relative overflow-hidden bg-intima-sand/20',
        className
      )}
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={proyecto.imagen_portada || '/placeholder.jpg'}
          alt={proyecto.titulo}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Overlay en hover */}
        <div className="absolute inset-0 bg-intima-black/0 group-hover:bg-intima-black/30 transition-all duration-500" />
      </div>

      {/* Info */}
      <div className="pt-4 pb-2">
        <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-1">
          {proyecto.categoria}
        </p>
        <h3 className="font-display text-intima-black text-lg leading-tight group-hover:text-intima-brown transition-colors duration-200">
          {proyecto.titulo}
        </h3>
        {proyecto.descripcion && (
          <p className="font-body text-sm text-intima-dark/70 mt-2 line-clamp-2">
            {proyecto.descripcion}
          </p>
        )}
      </div>
    </Link>
  )
}
