'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/',         label: 'Inicio' },
  { href: '/galeria',  label: 'Proyectos' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar menú al cambiar de ruta
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-intima-beige/95 backdrop-blur-sm border-b border-intima-sand/40 py-4'
          : 'bg-transparent py-7'
      )}
    >
      <div className="container-site flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="group">
          <span className={cn(
            'font-display text-2xl tracking-tight transition-colors duration-300',
            scrolled ? 'text-intima-black' : 'text-intima-black'
          )}>
            {/* Reemplazá esto con tu logo SVG cuando lo tengas */}
            <span className="font-display">Íntima</span>
            <span className="font-body font-light text-intima-brown text-sm ml-1">.studio</span>
          </span>
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'font-body text-sm tracking-widest uppercase transition-all duration-200',
                pathname === href
                  ? 'text-intima-brown border-b border-intima-brown pb-0.5'
                  : 'text-intima-dark hover:text-intima-brown'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Hamburger Mobile */}
        <button
          className="md:hidden text-intima-dark p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menú Mobile */}
      <div className={cn(
        'md:hidden overflow-hidden transition-all duration-300 bg-intima-beige border-b border-intima-sand/40',
        menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <nav className="container-site py-6 flex flex-col gap-5">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'font-body text-sm tracking-widest uppercase',
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
