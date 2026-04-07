'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props { id: string; titulo: string }

export default function DeleteProyectoButton({ id, titulo }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/proyectos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Proyecto eliminado')
      router.refresh()
    } catch {
      toast.error('Error al eliminar')
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-body text-xs text-red-500">¿Eliminar?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="font-body text-xs text-red-500 font-medium hover:underline"
        >
          {loading ? '...' : 'Sí'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="font-body text-xs text-intima-dark/40 hover:underline"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 text-intima-dark/40 hover:text-red-400 transition-colors"
      title={`Eliminar "${titulo}"`}
    >
      <Trash2 size={15} />
    </button>
  )
}
