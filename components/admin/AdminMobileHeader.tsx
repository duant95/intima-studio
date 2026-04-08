'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Menu, X, LayoutDashboard, Images, MessageSquare, Settings, PlusSquare, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/admin',               label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/admin/proyectos',     label: 'Proyectos',       icon: Images },
  { href: '/admin/proyectos/nuevo', label: 'Nuevo proyecto', icon: PlusSquare },
  { href: '/admin/mensajes',      label: 'Mensajes',        icon: MessageSquare },
  { href: '/admin/configuracion', label: 'Configuración',   icon: Settings },
]

export default function AdminMobileHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      {/* Header móvil */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-intima-black flex items-center justify-between px-4 h-14">
        <span className="font-display text-intima-beige text-lg">
          Íntima <span className="font-body font-light text-intima-brown text-xs">.admin</span>
        </span>
        <button
          onClick={() => setOpen(!open)}
          className="text-intima-sand p-1"
          aria-label="Menú"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Drawer móvil */}
      <div className={cn(
        'md:hidden fixed inset-0 z-40 transition-all duration-300',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      )}>
        {/* Overlay */}
        <div
          className={cn('absolute inset-0 bg-black transition-opacity duration-300', open ? 'opacity-50' : 'opacity-0')}
          onClick={() => setOpen(false)}
        />
        {/* Menú */}
        <nav className={cn(
          'absolute top-14 left-0 bottom-0 w-64 bg-intima-black flex flex-col transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded font-body text-sm transition-colors',
                  pathname === href
                    ? 'bg-intima-brown/20 text-intima-beige'
                    : 'text-intima-sand/60 hover:text-intima-sand'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
          <div className="px-4 pb-8">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-3 w-full text-intima-sand/50 hover:text-red-400 font-body text-sm transition-colors"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}
