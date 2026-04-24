import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-intima-beige flex flex-col items-center justify-center px-6 text-center">

      {/* Logo */}
      <Link href="/" className="mb-16 block">
        <Image
          src="/logo-studio-dark.png"
          alt="Íntima Studio"
          width={140}
          height={40}
          className="h-7 w-auto object-contain brightness-0 mx-auto"
        />
      </Link>

      {/* Número */}
      <p className="font-display text-[12rem] md:text-[18rem] leading-none text-intima-sand/40 select-none -my-8">
        404
      </p>

      {/* Mensaje */}
      <div className="relative z-10 mt-4">
        <p className="font-body text-xs tracking-widest uppercase text-intima-brown mb-4">
          Página no encontrada
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-intima-black mb-5 leading-tight">
          Este espacio<br />
          <span className="italic">está vacío</span>
        </h1>
        <p className="font-body text-intima-dark/60 text-sm max-w-xs mx-auto mb-10 leading-relaxed">
          La página que buscás no existe o fue movida. Explorá el resto del sitio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-block bg-intima-brown text-intima-beige font-body text-xs tracking-widest uppercase px-8 py-4 hover:bg-intima-black transition-colors duration-300"
          >
            Volver al inicio
          </Link>
          <Link
            href="/galeria"
            className="inline-block border border-intima-brown/40 text-intima-brown font-body text-xs tracking-widest uppercase px-8 py-4 hover:border-intima-brown transition-all duration-300"
          >
            Ver proyectos
          </Link>
        </div>
      </div>
    </div>
  )
}
