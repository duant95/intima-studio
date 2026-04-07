import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  // ─── Rate limiting: máx 3 mensajes por IP cada 10 minutos ─────────
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { allowed } = rateLimit(ip, { limit: 3, windowMs: 10 * 60 * 1000 })

  if (!allowed) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Esperá unos minutos.' },
      { status: 429 }
    )
  }

  const body = await req.json()
  const { nombre, email, telefono, mensaje, _honey } = body

  // ─── Honeypot anti-spam: si el campo oculto viene con datos, es un bot ──
  if (_honey) {
    // Respondemos 200 para no dar pistas al bot
    return NextResponse.json({ success: true }, { status: 200 })
  }

  // ─── Validaciones ─────────────────────────────────────────────────
  if (!nombre || !email || !mensaje) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  if (nombre.length > 100 || mensaje.length > 2000) {
    return NextResponse.json({ error: 'Contenido demasiado largo' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('mensajes')
    .insert([{ nombre, email, telefono: telefono || null, mensaje, leido: false }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true }, { status: 201 })
}
