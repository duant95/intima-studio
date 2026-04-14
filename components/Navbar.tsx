'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/',         label: 'Inicio' },
  { href: '/galeria',  label: 'Proyectos' },
  { href: '/taller',   label: 'El Taller' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

// Páginas que tienen hero oscuro — el navbar arranca en blanco
const HERO_PAGES = ['/']

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const hasHero = HERO_PAGES.includes(pathname)
  // Transparente y blanco solo en la home sin scroll
  const isLight = hasHero && !scrolled

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled || menuOpen
          ? 'bg-intima-beige/97 backdrop-blur-sm border-b border-intima-sand/40 py-4'
          : 'bg-transparent py-7'
      )}
    >
      <div className="container-site flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="group flex-shrink-0">
          <Image
            src="/logo-studio-dark.png"
            alt="Íntima Studio"
            width={140}
            height={40}
            className={cn(
              'h-7 md:h-8 w-auto object-contain transition-all duration-500',
              isLight ? 'brightness-0 invert' : 'brightness-0'
            )}
            priority
          />
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'font-body text-xs tracking-widest uppercase transition-all duration-300 pb-0.5',
                pathname === href
                  ? isLight
                    ? 'text-intima-beige border-b border-intima-beige/60'
                    : 'text-intima-brown border-b border-intima-brown'
                  : isLight
                    ? 'text-intima-sand/80 hover:text-intima-beige'
                    : 'text-intima-dark hover:text-intima-brown'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Hamburger Mobile */}
        <button
          className={cn(
            'md:hidden p-2 transition-colors duration-300',
            isLight ? 'text-intima-beige' : 'text-intima-dark'
          )}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menú Mobile — siempre fondo beige */}
      <div className={cn(
        'md:hidden overflow-hidden transition-all duration-300 bg-intima-beige',
        menuOpen ? 'max-h-96 opacity-100 border-b border-intima-sand/40' : 'max-h-0 opacity-0'
      )}>
        <nav className="container-site py-6 flex flex-col gap-5">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'font-body text-sm tracking-widest uppercase py-1',
                pathname === href ? 'text-intima-brown' : 'text-intima-dark'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
