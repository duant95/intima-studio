import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Íntima Studio — Diseño de Interiores',
    template: '%s | Íntima Studio',
  },
  description:
    'Estudio de diseño de interiores en Asunción, Paraguay. Transformamos espacios en experiencias únicas con un enfoque en la calidad y la innovación.',
  keywords: ['diseño de interiores', 'Paraguay', 'Asunción', 'Íntima Studio', 'interiorismo'],
  openGraph: {
    type: 'website',
    locale: 'es_PY',
    siteName: 'Íntima Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Íntima Studio — Diseño de Interiores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
