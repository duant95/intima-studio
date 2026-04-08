import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-intima-black text-intima-sand/70">
      <div className="container-site py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 pb-10 md:pb-12 border-b border-intima-dark">

          {/* Marca */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-intima-beige text-2xl mb-4">
              Íntima<span className="font-body font-light text-intima-brown text-sm ml-1">.studio</span>
            </p>
            <p className="font-body text-sm leading-relaxed text-intima-sand/60 max-w-xs">
              Diseño de interiores con alma. Transformamos espacios en experiencias únicas.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-intima-sand/40 mb-5">
              Navegación
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { href: '/',         label: 'Inicio' },
                { href: '/galeria',  label: 'Proyectos' },
                { href: '/nosotros', label: 'Nosotros' },
                { href: '/contacto', label: 'Contacto' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-body text-sm hover:text-intima-beige transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-intima-sand/40 mb-5">
              Contacto
            </p>
            <div className="flex flex-col gap-3 text-sm font-body">
              <a
                href="mailto:hola@intimastudio.com"
                className="hover:text-intima-beige transition-colors duration-200"
              >
                hola@intimastudio.com
              </a>
              <a
                href="https://instagram.com/intima.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-intima-beige transition-colors duration-200"
              >
                @intima.studio
              </a>
              <p className="text-intima-sand/50">Asunción, Paraguay</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-body text-xs text-intima-sand/40">
            © {year} Íntima Studio. Todos los derechos reservados.
          </p>
          <p className="font-body text-xs text-intima-sand/30">
            Diseño & Desarrollo con ♥
          </p>
        </div>
      </div>
    </footer>
  )
}
