interface Props {
  className?: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

// Logo CR Mueble — recreado en SVG basado en identidad visual
export default function CRMebleLogo({ className = '', color = '#a08882', size = 'md' }: Props) {
  const heights = { sm: 28, md: 40, lg: 56 }
  const h = heights[size]

  return (
    <svg
      viewBox="0 0 260 80"
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-label="CR Mueble"
    >
      {/* ─── C ─── open arc */}
      <path
        d="M44 14 A26 26 0 1 0 44 66"
        stroke={color} strokeWidth="6" strokeLinecap="round"
      />

      {/* ─── R ─── vertical stroke */}
      <line x1="76" y1="14" x2="76" y2="66" stroke={color} strokeWidth="6" strokeLinecap="round" />
      {/* R bump top */}
      <path
        d="M76 14 C94 14 100 22 100 32 C100 42 93 48 76 48"
        stroke={color} strokeWidth="6" strokeLinecap="round"
      />
      {/* R tail curving down */}
      <path
        d="M83 48 Q100 56 100 66"
        stroke={color} strokeWidth="6" strokeLinecap="round" fill="none"
      />

      {/* dot — signature mark of CR logo */}
      <circle cx="34" cy="40" r="3.5" fill={color} />

      {/* ─── MEBLE text ─── */}
      {/* M */}
      <polyline points="118,62 118,22 132,46 146,22 146,62" stroke={color} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      {/* E */}
      <polyline points="156,22 156,62" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
      <line x1="156" y1="22" x2="173" y2="22" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="156" y1="42" x2="170" y2="42" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="156" y1="62" x2="173" y2="62" stroke={color} strokeWidth="5" strokeLinecap="round" />
      {/* B — drawn as two rectangles with dots (furniture/drawer reference) */}
      <line x1="182" y1="22" x2="182" y2="62" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M182 22 C196 22 200 28 200 32 C200 36 196 42 182 42" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M182 42 C198 42 203 48 203 52 C203 57 198 62 182 62" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* dots in B (drawer pulls) */}
      <circle cx="196" cy="32" r="2.5" fill={color} />
      <circle cx="198" cy="52" r="2.5" fill={color} />
      {/* L */}
      <line x1="212" y1="22" x2="212" y2="62" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="212" y1="62" x2="229" y2="62" stroke={color} strokeWidth="5" strokeLinecap="round" />
      {/* E */}
      <polyline points="238,22 238,62" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
      <line x1="238" y1="22" x2="255" y2="22" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="238" y1="42" x2="252" y2="42" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="238" y1="62" x2="255" y2="62" stroke={color} strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}
