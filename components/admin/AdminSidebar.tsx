'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Images,
  MessageSquare,
  Settings,
  LogOut,
  PlusSquare,
  ShoppingBag,
} from 'lucide-react'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/admin',               label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/proyectos',     label: 'Proyectos',  icon: Images },
  { href: '/admin/servicios',     label: 'Servicios',  icon: ShoppingBag },
  { href: '/admin/mensajes',      label: 'Mensajes',   icon: MessageSquare },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-intima-black text-intima-sand hidden md:flex flex-col z-40">

      {/* Logo */}
      <div className="px-7 py-6 border-b border-intima-dark">
        <Link href="/" target="_blank" className="group block">
          <Image
            src="/logo-studio-dark.png"
            alt="Íntima Studio"
            width={120}
            height={34}
            className="h-6 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <p className="font-body text-xs text-intima-sand/30 mt-1.5">Panel Admin</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded font-body text-sm transition-colors duration-200',
              pathname === href
                ? 'bg-intima-brown/20 text-intima-beige'
                : 'text-intima-sand/60 hover:text-intima-sand hover:bg-intima-dark/50'
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}

        <div className="pt-4">
          <Link
            href="/admin/proyectos/nuevo"
            className="flex items-center gap-3 px-3 py-2.5 bg-intima-brown text-intima-beige rounded font-body text-sm hover:bg-intima-brown/90 transition-colors"
          >
            <PlusSquare size={16} />
            Nuevo proyecto
          </Link>
        </div>
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-intima-sand/50 hover:text-red-400 font-body text-sm transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
