# Íntima Studio — Guía de instalación

## Requisitos previos
- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [Vercel](https://vercel.com) para deploy (gratis)

---

## 1. Instalar dependencias

```bash
npm install
```

---

## 2. Configurar Supabase

1. Entrá a [supabase.com](https://supabase.com) y creá un proyecto nuevo
2. Andá a **SQL Editor** y ejecutá el contenido de `supabase-setup.sql`
3. Andá a **Settings > API** y copiá:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Variables de entorno

```bash
cp .env.local.example .env.local
```

Editá `.env.local` con tus valores de Supabase.

---

## 4. Crear usuario administrador

1. En Supabase, andá a **Authentication > Users**
2. Hacé clic en **Add user**
3. Ingresá email y contraseña — esas serán las credenciales del panel admin

---

## 5. Agregar las fuentes

Colocá los archivos de fuente en `/public/fonts/`:
- `MonumentExtended-Regular.woff2`
- `TTHovesPro-Regular.woff2`
- `TTHovesPro-Medium.woff2`
- `TTHovesPro-Light.woff2`

> Si no tenés las licencias todavía, el sitio funciona igual con las fuentes de sistema como fallback.

---

## 6. Correr en local

```bash
npm run dev
```

- Sitio: http://localhost:3000
- Panel admin: http://localhost:3000/admin

---

## 7. Deploy en Vercel

```bash
npm install -g vercel
vercel
```

Cuando Vercel te pregunte, agregá las 3 variables de entorno.

O conectá tu repo de GitHub a Vercel desde el dashboard — deployará automáticamente con cada push.

---

## Rutas importantes

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio |
| `/galeria` | Todos los proyectos |
| `/galeria/[id]` | Detalle de un proyecto |
| `/nosotros` | Sobre el estudio |
| `/contacto` | Formulario de contacto |
| `/admin` | Dashboard admin |
| `/admin/login` | Login admin |
| `/admin/proyectos` | Gestión de proyectos |
| `/admin/proyectos/nuevo` | Crear proyecto |
| `/admin/mensajes` | Ver mensajes de contacto |

---

## Personalización

### Cambiar email, Instagram, etc.
Buscá en `components/Footer.tsx` y `app/(site)/contacto/page.tsx` los datos de contacto.

### Cambiar el texto del hero y secciones
Editá `app/(site)/page.tsx` para la página de inicio.

### Cambiar el logo
Reemplazá el texto "Íntima .studio" en `components/Navbar.tsx` con tu SVG.
