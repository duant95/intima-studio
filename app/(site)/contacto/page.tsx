import { Metadata } from 'next'
import { Mail, Instagram, MapPin } from 'lucide-react'
import { getSiteConfig } from '@/lib/config'
import ContactoForm from '@/components/ContactoForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Hablemos de tu proyecto. Estudio de diseño de interiores en Asunción, Paraguay.',
}

export default async function ContactoPage() {
  const config = await getSiteConfig()

  return (
    <>
      {/* Header */}
      <section className="pt-28 md:pt-40 pb-10 md:pb-16 bg-intima-beige">
        <div className="container-site">
          <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">
            Hablemos
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-intima-black leading-none">
            Contacto
          </h1>
        </div>
      </section>

      {/* Contenido */}
      <section className="pb-24 bg-intima-beige">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Info */}
            <div className="lg:col-span-2">
              <p className="font-body text-intima-dark/70 leading-relaxed mb-10">
                Nos encanta conocer proyectos nuevos. Contanos qué tenés en mente y coordinamos una primera reunión.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail size={16} className="text-intima-brown mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-intima-dark/40 mb-1">Email</p>
                    <a
                      href={`mailto:${config.contacto_email}`}
                      className="font-body text-sm text-intima-dark hover:text-intima-brown transition-colors"
                    >
                      {config.contacto_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Instagram size={16} className="text-intima-brown mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-intima-dark/40 mb-1">Instagram</p>
                    <a
                      href={`https://instagram.com/${config.contacto_instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-intima-dark hover:text-intima-brown transition-colors"
                    >
                      @{config.contacto_instagram.replace('@', '')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin size={16} className="text-intima-brown mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-intima-dark/40 mb-1">Ubicación</p>
                    <p className="font-body text-sm text-intima-dark">{config.contacto_ubicacion}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="lg:col-span-3">
              <ContactoForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
