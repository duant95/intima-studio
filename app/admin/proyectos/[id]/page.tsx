export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase'
import ProyectoForm from '@/components/admin/ProyectoForm'

interface Props { params: { id: string } }

export const metadata: Metadata = { title: 'Editar Proyecto — Admin' }

export default async function EditarProyectoPage({ params }: Props) {
  const supabase = createAdminClient()
  const { data: proyecto } = await supabase
    .from('proyectos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!proyecto) notFound()

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
          <h1 className="font-display text-3xl text-intima-black">Editar proyecto</h1>
          <p className="font-body text-sm text-intima-dark/50 mt-0.5">{proyecto.titulo}</p>
        </div>
      </div>

      <ProyectoForm proyecto={proyecto} isEditing />
    </div>
  )
}
