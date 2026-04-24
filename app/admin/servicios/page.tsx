export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase'
import Link from 'next/link'
import { PlusSquare, Pencil, Star, ShoppingBag } from 'lucide-react'
import DeletePaqueteButton from '@/components/admin/DeletePaqueteButton'
import type { Paquete } from '@/app/(site)/servicios/page'

async function getPaquetes(): Promise<Paquete[]> {
  const supabase = createAdminClient()
  const { data } = await supabase.from('paquetes').select('*').order('orden', { ascending: true })
  return (data ?? []) as Paquete[]
}

const formatPrecio = (precio: number) =>
  new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 }).format(precio)

export default async function AdminServiciosPage() {
  const paquetes = await getPaquetes()

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-intima-black">Servicios</h1>
          <p className="font-body text-sm text-intima-dark/50 mt-1">{paquetes.length} paquete{paquetes.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/servicios/nuevo" className="flex items-center gap-2 bg-intima-brown text-intima-beige font-body text-sm tracking-wide px-5 py-2.5 rounded hover:bg-intima-black transition-colors">
          <PlusSquare size={15} /> Nuevo
        </Link>
      </div>

      {paquetes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <ShoppingBag size={40} className="text-intima-sand mx-auto mb-4" />
          <p className="font-body text-intima-dark/50 mb-4">Aún no hay paquetes</p>
          <Link href="/admin/servicios/nuevo" className="font-body text-sm text-intima-brown underline">Crear el primero</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left font-body text-xs tracking-widest uppercase text-intima-dark/40 px-6 py-4">Paquete</th>
                <th className="text-left font-body text-xs tracking-widest uppercase text-intima-dark/40 px-4 py-4 hidden md:table-cell">Categoría</th>
                <th className="text-left font-body text-xs tracking-widest uppercase text-intima-dark/40 px-4 py-4 hidden md:table-cell">Precio</th>
                <th className="text-left font-body text-xs tracking-widest uppercase text-intima-dark/40 px-4 py-4 hidden lg:table-cell">Estado</th>
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody>
              {paquetes.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.imagen_url && (
                        <div className="w-12 h-9 rounded overflow-hidden flex-shrink-0 bg-intima-sand/30">
                          <img src={p.imagen_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-body text-sm text-intima-black font-medium line-clamp-1">{p.nombre}</p>
                        {p.destacado && <span className="inline-flex items-center gap-1 font-body text-xs text-intima-brown"><Star size={10} className="fill-intima-brown" /> Destacado</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="font-body text-xs bg-intima-beige text-intima-brown px-2 py-1 rounded">{p.categoria}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="font-body text-sm text-intima-black">{p.precio ? formatPrecio(p.precio) : '—'}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className={`font-body text-xs px-2 py-1 rounded ${true ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>Activo</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <Link href={`/admin/servicios/${p.id}`} className="p-1.5 text-intima-dark/40 hover:text-intima-brown transition-colors" title="Editar">
                        <Pencil size={15} />
                      </Link>
                      <DeletePaqueteButton id={p.id} nombre={p.nombre} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
