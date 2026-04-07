import { createAdminClient } from '@/lib/supabase'
import Link from 'next/link'
import { Images, MessageSquare, PlusSquare, Eye } from 'lucide-react'

async function getStats() {
  const supabase = createAdminClient()
  const [{ count: totalProyectos }, { count: mensajesNuevos }] = await Promise.all([
    supabase.from('proyectos').select('*', { count: 'exact', head: true }),
    supabase.from('mensajes').select('*', { count: 'exact', head: true }).eq('leido', false),
  ])
  return { totalProyectos: totalProyectos ?? 0, mensajesNuevos: mensajesNuevos ?? 0 }
}

export default async function AdminDashboard() {
  const { totalProyectos, mensajesNuevos } = await getStats()

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl text-intima-black">Dashboard</h1>
        <p className="font-body text-sm text-intima-dark/50 mt-1">
          Bienvenida al panel de administración de Íntima Studio
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<Images size={20} className="text-intima-brown" />}
          label="Proyectos publicados"
          value={totalProyectos}
          href="/admin/proyectos"
        />
        <StatCard
          icon={<MessageSquare size={20} className="text-intima-brown" />}
          label="Mensajes sin leer"
          value={mensajesNuevos}
          href="/admin/mensajes"
          highlight={mensajesNuevos > 0}
        />
        <StatCard
          icon={<Eye size={20} className="text-intima-brown" />}
          label="Ver sitio"
          value="↗"
          href="/"
          external
        />
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-body font-medium text-intima-dark text-sm mb-5">Acciones rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/proyectos/nuevo"
            className="flex items-center gap-3 p-4 border border-intima-sand/60 rounded-lg hover:border-intima-brown hover:bg-intima-beige/30 transition-all font-body text-sm text-intima-dark"
          >
            <PlusSquare size={16} className="text-intima-brown" />
            Agregar nuevo proyecto
          </Link>
          <Link
            href="/admin/mensajes"
            className="flex items-center gap-3 p-4 border border-intima-sand/60 rounded-lg hover:border-intima-brown hover:bg-intima-beige/30 transition-all font-body text-sm text-intima-dark"
          >
            <MessageSquare size={16} className="text-intima-brown" />
            Ver mensajes de contacto
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon, label, value, href, external, highlight,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  href: string
  external?: boolean
  highlight?: boolean
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      className="bg-white rounded-xl border border-gray-100 p-6 hover:border-intima-sand transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-intima-beige rounded-lg">{icon}</div>
        {highlight && (
          <span className="bg-intima-brown text-intima-beige text-xs font-body px-2 py-0.5 rounded-full">
            Nuevo
          </span>
        )}
      </div>
      <p className="font-display text-3xl text-intima-black">{value}</p>
      <p className="font-body text-sm text-intima-dark/50 mt-1">{label}</p>
    </Link>
  )
}
