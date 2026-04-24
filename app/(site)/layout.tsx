import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Toaster } from 'react-hot-toast'
import { getSiteConfig } from '@/lib/config'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = await getSiteConfig()

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton numero={config.whatsapp_numero} mensaje={config.whatsapp_mensaje} />
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: '#231f20',
            color: '#e4e1dc',
            fontFamily: 'TTHovesPro, Inter, sans-serif',
            fontSize: '14px',
          },
        }}
      />
    </>
  )
}
