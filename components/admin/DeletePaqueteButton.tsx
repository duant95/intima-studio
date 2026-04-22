'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DeletePaqueteButton({ id, nombre }: { id: string; nombre: string }) {
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const res = await fetch(`/api/servicios/${id}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Error al eliminar'); return }
    toast.success('Paquete eliminado')
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={handleDelete} className="font-body text-xs text-red-500 hover:text-red-700 font-medium">Sí, eliminar</button>
        <button onClick={() => setConfirming(false)} className="font-body text-xs text-intima-dark/40">Cancelar</button>
      </div>
    )
  }
  return (
    <button onClick={() => setConfirming(true)} className="p-1.5 text-intima-dark/40 hover:text-red-400 transition-colors" title="Eliminar">
      <Trash2 size={15} />
    </button>
  )
}
