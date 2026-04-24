import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

async function getSession() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value, set: () => {}, remove: () => {} } }
  )
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('configuracion').select('clave, valor')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  // Convertir array [{clave, valor}] → objeto {clave: valor}
  const config: Record<string, string> = {}
  for (const row of data ?? []) config[row.clave] = row.valor ?? ''
  return NextResponse.json(config)
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body: Record<string, string> = await req.json()
  const supabase = createAdminClient()

  // Upsert cada clave-valor
  const upserts = Object.entries(body).map(([clave, valor]) => ({
    clave,
    valor,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('configuracion')
    .upsert(upserts, { onConflict: 'clave' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/')
  revalidatePath('/nosotros')
  revalidatePath('/taller')
  return NextResponse.json({ success: true })
}
