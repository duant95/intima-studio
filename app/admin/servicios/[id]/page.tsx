import { createAdminClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import PaqueteForm from '@/components/admin/PaqueteForm'
import type { Paquete } from '@/app/(site)/servicios/page'

export default async function EditarPaquetePage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { data } = await supabase.from('paquetes').select('*').eq('id', params.id).single()
  if (!data) notFound()
  return (
    <div>
      <h1 className="font-display text-3xl text-intima-black mb-8">Editar paquete</h1>
      <PaqueteForm paquete={data as Paquete} isEditing />
    </div>
  )
}
