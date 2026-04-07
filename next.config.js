/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
    ],
  },

  // ─── Headers de seguridad HTTP ────────────────────────────────────
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Evita que la página sea embebida en iframes (clickjacking)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Evita que el navegador adivine el tipo de contenido
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Fuerza HTTPS por 1 año
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Controla qué información de referencia se envía
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restringe permisos del navegador innecesarios
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Protección XSS básica para navegadores antiguos
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      // Headers especiales para archivos de fuentes (evita errores CORS)
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
