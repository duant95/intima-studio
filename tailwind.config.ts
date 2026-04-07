import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial Íntima Studio
        'intima': {
          'brown':    '#5c5449',  // marrón cálido principal
          'beige':    '#e4e1dc',  // beige claro (fondo)
          'sand':     '#cbc4ba',  // beige medio
          'dark':     '#393939',  // gris oscuro
          'black':    '#231f20',  // casi negro (texto)
        },
      },
      fontFamily: {
        // Monument Extended — agregar archivos en /public/fonts/
        // Si no tenés la licencia, reemplazá con el nombre correcto
        display: ['MonumentExtended', 'Georgia', 'serif'],
        // TT Hoves Pro — agregar archivos en /public/fonts/
        body: ['TTHovesPro', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        'widest-2': '0.2em',
        'widest-3': '0.3em',
      },
      aspectRatio: {
        '3/4': '3 / 4',
        '4/3': '4 / 3',
        '16/9': '16 / 9',
      },
    },
  },
  plugins: [],
}

export default config
