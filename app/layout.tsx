import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const SITE_URL = 'https://www.intimastudio.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Íntima Studio — Diseño de Interiores en Asunción, Paraguay',
    template: '%s | Íntima Studio',
  },
  description:
    'Estudio boutique de diseño de interiores en Asunción, Paraguay. Transformamos espacios residenciales y comerciales en experiencias únicas. Proyectos 3D, muebles a medida y asesoría personalizada.',
  keywords: [
    'diseño de interiores', 'interiorismo', 'Paraguay', 'Asunción',
    'Íntima Studio', 'diseño residencial', 'diseño comercial',
    'muebles a medida', 'decoración de interiores', 'proyecto 3D',
    'remodelación', 'ambientación', 'diseñadora de interiores Paraguay',
  ],
  authors: [{ name: 'Íntima Studio' }],
  creator: 'Íntima Studio',
  openGraph: {
    type: 'website',
    locale: 'es_PY',
    url: SITE_URL,
    siteName: 'Íntima Studio',
    title: 'Íntima Studio — Diseño de Interiores en Asunción, Paraguay',
    description:
      'Estudio boutique de diseño de interiores en Asunción, Paraguay. Transformamos espacios en experiencias únicas con atención al detalle.',
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
    title: 'Íntima Studio — Diseño de Interiores',
    description: 'Estudio boutique de diseño de interiores en Asunción, Paraguay.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'InteriorDesigner',
  name: 'Íntima Studio',
  description:
    'Estudio boutique de diseño de interiores en Asunción, Paraguay. Especialistas en diseño residencial, comercial y muebles a medida.',
  url: SITE_URL,
  telephone: '+595981132221',
  email: 'hola@intimastudio.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Asunción',
    addressCountry: 'PY',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Paraguay',
  },
  priceRange: '$$',
  sameAs: ['https://www.instagram.com/intima.studio'],
  image: `${SITE_URL}/og-image.jpg`,
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '18:00',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2ZRCTCFNSF"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2ZRCTCFNSF');
          `}
        </Script>
      </body>
    </html>
  )
}
