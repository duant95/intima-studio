'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  videoUrl?: string
  alt?: string
  aspectClass?: string
  placeholder?: string
}

export default function MediaSlider({
  images,
  videoUrl,
  alt = '',
  aspectClass = 'aspect-[4/3]',
  placeholder = 'Imagen',
}: Props) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (videoUrl || images.length <= 1) return
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 4500)
    return () => clearInterval(t)
  }, [images.length, videoUrl])

  return (
    <div className={`relative ${aspectClass} overflow-hidden bg-intima-sand/40`}>
      {videoUrl ? (
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={videoUrl} />
        </video>
      ) : images.length > 0 ? (
        <>
          {images.map((url, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
            >
              <Image src={url} alt={alt} fill className="object-cover" />
            </div>
          ))}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Imagen ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === idx ? 'w-4 h-1.5 bg-intima-beige' : 'w-1.5 h-1.5 bg-intima-beige/50 hover:bg-intima-beige/70'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="font-body text-xs tracking-widest uppercase text-intima-brown/30">{placeholder}</p>
        </div>
      )}
    </div>
  )
}
