// Rate limiter simple en memoria
// Para producción con mucho tráfico, reemplazá con Upstash Redis

const requests = new Map<string, { count: number; resetAt: number }>()

interface RateLimitOptions {
  limit: number      // máximo de requests
  windowMs: number   // ventana de tiempo en ms
}

export function rateLimit(ip: string, options: RateLimitOptions): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const key = ip
  const entry = requests.get(key)

  // Si no existe o la ventana ya expiró, reset
  if (!entry || now > entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + options.windowMs })
    return { allowed: true, remaining: options.limit - 1 }
  }

  // Si superó el límite
  if (entry.count >= options.limit) {
    return { allowed: false, remaining: 0 }
  }

  // Incrementar
  entry.count++
  return { allowed: true, remaining: options.limit - entry.count }
}

// Limpiar entradas viejas cada 10 minutos para evitar memory leaks
setInterval(() => {
  const now = Date.now()
  requests.forEach((entry, key) => {
    if (now > entry.resetAt) requests.delete(key)
  })
}, 10 * 60 * 1000)
