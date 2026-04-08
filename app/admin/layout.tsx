import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminMobileHeader from '@/components/admin/AdminMobileHeader'
import { Toaster } from 'react-hot-toast'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar sesión para saber si mostrar el sidebar
  // La protección real está en middleware.ts — no redirigir acá para evitar loops
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set() {},
        remove() {},
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Si no hay sesión, solo renderizar el contenido (la página de login)
  // El middleware ya se encarga de bloquear rutas protegidas
  if (!session) {
    return (
      <>
        {children}
        <Toaster position="bottom-right" />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <AdminMobileHeader />
      <main className="flex-1 ml-0 md:ml-64 transition-all pt-14 md:pt-0">
        <div className="p-4 md:p-10 max-w-6xl">
          {children}
        </div>
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#231f20',
            color: '#e4e1dc',
            fontSize: '14px',
          },
        }}
      />
    </div>
  )
}
