import Image from 'next/image'

interface Props {
  className?: string
  color?: string   // kept for API compatibility, unused (PNG has its own color)
  size?: 'sm' | 'md' | 'lg'
}

export default function CRMebleLogo({ className = '', size = 'md' }: Props) {
  const heights = { sm: 22, md: 34, lg: 50 }
  const h = heights[size]
  // original PNG is 800×244 → maintain aspect ratio
  const w = Math.round(h * (800 / 244))

  return (
    <Image
      src="/cr-meble-logo.png"
      alt="CR Mueble"
      width={w}
      height={h}
      className={className}
      style={{ height: h, width: 'auto' }}
    />
  )
}
