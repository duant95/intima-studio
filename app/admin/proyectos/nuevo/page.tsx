import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProyectoForm from '@/components/admin/ProyectoForm'

export const metadata: Metadata = { title: 'Nuevo Proyecto — Admin' }

export default function NuevoProyectoPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/proyectos"
          className="p-1.5 text-intima-dark/40 hover:text-intima-dark transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-3xl text-intima-black">Nuevo proyecto</h1>
          <p className="font-body text-sm text-intima-dark/50 mt-0.5">
            Completá los datos y subí las imágenes
          </p>
        </div>
      </div>

      <ProyectoForm />
    </div>
  )
}
