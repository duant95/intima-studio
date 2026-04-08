
import { createAdminClient, type Mensaje } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Mail, MailOpen } from 'lucide-react'
import MensajeRow from '@/components/admin/MensajeRow'

async function getMensajes(): Promise<Mensaje[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('mensajes')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminMensajesPage() {
  const mensajes = await getMensajes()
  const sinLeer = mensajes.filter((m) => !m.leido).length

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-intima-black">Mensajes</h1>
          <p className="font-body text-sm text-intima-dark/50 mt-1">
            {sinLeer > 0 ? `${sinLeer} sin leer` : 'Todos leídos'}
          </p>
        </div>
      </div>

      {mensajes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <Mail size={40} className="text-intima-sand mx-auto mb-4" />
          <p className="font-body text-intima-dark/50">Aún no hay mensajes</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {mensajes.map((mensaje) => (
            <MensajeRow key={mensaje.id} mensaje={mensaje} />
          ))}
        </div>
      )}
    </div>
  )
}