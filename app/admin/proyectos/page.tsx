import { createAdminClient, type Proyecto } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { PlusSquare, Pencil, Trash2, Star } from 'lucide-react'
import DeleteProyectoButton from '@/components/admin/DeleteProyectoButton'

async function getProyectos(): Promise<Proyecto[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('proyectos')
    .select('*')
    .order('orden', { ascending: true })
  return data ?? []
}

export default async function AdminProyectosPage() {
  const proyectos = await getProyectos()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-intima-black">Proyectos</h1>
          <p className="font-body text-sm text-intima-dark/50 mt-1">
            {proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <Link
          href="/admin/proyectos/nuevo"
          className="flex items-center gap-2 bg-intima-brown text-intima-beige font-body text-sm tracking-wide px-5 py-2.5 rounded hover:bg-intima-black transition-colors"
        >
          <PlusSquare size={15} />
          Nuevo
        </Link>
      </div>

      {/* Lista */}
      {proyectos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <Images size={40} className="text-intima-sand mx-auto mb-4" />
          <p className="font-body text-intima-dark/50 mb-4">Aún no hay proyectos</p>
          <Link
            href="/admin/proyectos/nuevo"
            className="font-body text-sm text-intima-brown underline"
          >
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left font-body text-xs tracking-widest uppercase text-intima-dark/40 px-6 py-4">
                  Proyecto
                </th>
                <th className="text-left font-body text-xs tracking-widest uppercase text-intima-dark/40 px-4 py-4 hidden md:table-cell">
                  Categoría
                </th>
                <th className="text-left font-body text-xs tracking-widest uppercase text-intima-dark/40 px-4 py-4 hidden lg:table-cell">
                  Destacado
                </th>
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody>
              {proyectos.map((proyecto) => (
                <tr
                  key={proyecto.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Imagen + titulo */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-10 bg-intima-sand/30 rounded overflow-hidden flex-shrink-0">
                        {proyecto.imagen_portada && (
                          <Image
                            src={proyecto.imagen_portada}
                            alt={proyecto.titulo}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <p className="font-body text-sm text-intima-black font-medium line-clamp-1">
                        {proyecto.titulo}
                      </p>
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="font-body text-xs tracking-wide bg-intima-beige text-intima-brown px-2 py-1 rounded">
                      {proyecto.categoria}
                    </span>
                  </td>

                  {/* Destacado */}
                  <td className="px-4 py-4 hidden lg:table-cell">
                    {proyecto.destacado && (
                      <Star size={14} className="text-intima-brown fill-intima-brown" />
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/admin/proyectos/${proyecto.id}`}
                        className="p-1.5 text-intima-dark/40 hover:text-intima-brown transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </Link>
                      <DeleteProyectoButton id={proyecto.id} titulo={proyecto.titulo} />
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
