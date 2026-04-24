-- ═══════════════════════════════════════════════════════════════
-- ÍNTIMA STUDIO — Setup de base de datos en Supabase
-- Ejecutá esto en: supabase.com > tu proyecto > SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─── Tabla: proyectos ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS proyectos (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo          text NOT NULL,
  descripcion     text,
  categoria       text NOT NULL DEFAULT 'Residencial',
  imagenes        text[] DEFAULT '{}',
  imagen_portada  text,
  fecha           date DEFAULT CURRENT_DATE,
  destacado       boolean DEFAULT false,
  orden           integer DEFAULT 99,
  created_at      timestamptz DEFAULT now()
);

-- ─── Tabla: mensajes (formulario de contacto) ──────────────────
CREATE TABLE IF NOT EXISTS mensajes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      text NOT NULL,
  email       text NOT NULL,
  telefono    text,
  mensaje     text NOT NULL,
  leido       boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- ─── Row Level Security ────────────────────────────────────────
-- Proyectos: lectura pública, escritura solo autenticados
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proyectos_select_public"
  ON proyectos FOR SELECT USING (true);

CREATE POLICY "proyectos_insert_auth"
  ON proyectos FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "proyectos_update_auth"
  ON proyectos FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "proyectos_delete_auth"
  ON proyectos FOR DELETE USING (auth.role() = 'authenticated');

-- Mensajes: escritura pública (formulario), lectura solo autenticados
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mensajes_insert_public"
  ON mensajes FOR INSERT WITH CHECK (true);

CREATE POLICY "mensajes_select_auth"
  ON mensajes FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "mensajes_update_auth"
  ON mensajes FOR UPDATE USING (auth.role() = 'authenticated');

-- ─── Storage: bucket para imágenes ────────────────────────────
-- Ejecutá esto en Storage > New bucket
-- Nombre: "proyectos", Public: true
-- O ejecutá:
INSERT INTO storage.buckets (id, name, public)
VALUES ('proyectos', 'proyectos', true)
ON CONFLICT DO NOTHING;

-- Policy para storage: subida solo auth, lectura pública
CREATE POLICY "storage_select_public"
  ON storage.objects FOR SELECT USING (bucket_id = 'proyectos');

CREATE POLICY "storage_insert_auth"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'proyectos' AND auth.role() = 'authenticated'
  );

CREATE POLICY "storage_delete_auth"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'proyectos' AND auth.role() = 'authenticated'
  );

-- ─── Datos de ejemplo (opcional) ──────────────────────────────
-- Descomentá esto para tener un proyecto de muestra:

INSERT INTO proyectos (titulo, descripcion, categoria, imagen_portada, imagenes, destacado, orden)
VALUES (
  'Casa en Lambaré',
  'Remodelación completa de living y cocina integrada con materiales naturales.',
  'Residencial',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
  ARRAY['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'],
  true,
  1
);


-- ─── Tabla: config_site (textos editables desde el admin) ──────────
-- Ejecutá esto si ya corriste el script anterior
CREATE TABLE IF NOT EXISTS config_site (
  clave   text PRIMARY KEY,
  valor   text NOT NULL DEFAULT ''
);

ALTER TABLE config_site ENABLE ROW LEVEL SECURITY;

CREATE POLICY "config_select_public"
  ON config_site FOR SELECT USING (true);

CREATE POLICY "config_upsert_auth"
  ON config_site FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "config_update_auth"
  ON config_site FOR UPDATE USING (auth.role() = 'authenticated');

-- ─── TABLA PAQUETES (servicios/precios) ─────────────────────────────────────
create table if not exists paquetes (
  id          uuid        default gen_random_uuid() primary key,
  nombre      text        not null,
  descripcion text,
  precio      numeric(12,0),
  imagen_url  text,
  incluye     text[]      default '{}',
  categoria   text        not null default 'Residencial',
  activo      boolean     not null default true,
  destacado   boolean     not null default false,
  orden       integer     not null default 99,
  created_at  timestamptz default now()
);

alter table paquetes enable row level security;

create policy "paquetes_public_read"
  on paquetes for select
  using (activo = true);

create policy "paquetes_admin_all"
  on paquetes for all
  using (auth.role() = 'authenticated');

-- Datos de ejemplo para empezar
insert into paquetes (nombre, descripcion, precio, incluye, categoria, destacado, orden) values
  ('Diseño de Dormitorio',   'Proyecto completo de diseño de dormitorio principal.',  3500000, array['Proyecto 3D completo','Planos de construcción','Lista de compras','2 revisiones incluidas'], 'Dormitorio', true, 1),
  ('Diseño de Cocina',       'Proyecto integral de cocina con optimización de espacios.', 4800000, array['Proyecto 3D completo','Planos técnicos','Lista de materiales','Asesoría en compras'], 'Cocina', true, 2),
  ('Diseño de Baño',         'Rediseño completo de baño con selección de materiales.', 3800000, array['Proyecto 3D completo','Planos de obra','Lista de compras','1 visita de supervisión'], 'Baño', true, 3),
  ('Diseño de Living',       'Transformá tu sala de estar en un espacio único.', 4200000, array['Proyecto 3D completo','Planos de mobiliario','Paleta de materiales','2 revisiones incluidas'], 'Living', false, 4),
  ('Diseño de Patio/Jardín', 'Diseño paisajístico integral para exteriores.',          4800000, array['Proyecto 3D completo','Plano de paisajismo','Lista de plantas y materiales'], 'Exterior', false, 5),
  ('Diseño de Oficina',      'Espacios de trabajo que potencian la productividad.',    3200000, array['Proyecto 3D completo','Planos de layout','Selección de mobiliario','Asesoría en ergonomía'], 'Oficina', false, 6);

-- ═══════════════════════════════════════════════════════════════
-- CONFIGURACIÓN DEL SITIO — tabla clave-valor para imágenes y ajustes
-- Ejecutá en Supabase > SQL Editor
-- ═══════════════════════════════════════════════════════════════

create table if not exists configuracion (
  clave       text primary key,
  valor       text,
  updated_at  timestamptz default now()
);

alter table configuracion enable row level security;

create policy "config_public_read"
  on configuracion for select
  using (true);

create policy "config_admin_write"
  on configuracion for all
  using (auth.role() = 'authenticated');

-- Valores por defecto
insert into configuracion (clave, valor) values
  ('whatsapp_numero',       '595981132221'),
  ('whatsapp_mensaje',      '¡Hola! Me gustaría consultar sobre un proyecto de diseño de interiores.'),
  ('hero_imagen_url',       ''),
  ('intro_imagen_url',      ''),
  ('taller_home_imagen_1',  ''),
  ('taller_home_imagen_2',  ''),
  ('taller_home_imagen_3',  ''),
  ('taller_home_imagen_4',  ''),
  ('nosotros_imagen_url',   ''),
  ('og_imagen_url',         '')
on conflict (clave) do nothing;

-- ═══════════════════════════════════════════════════════════════
-- PROCESO en paquetes — columna para etapas del servicio
-- ═══════════════════════════════════════════════════════════════

alter table paquetes
  add column if not exists proceso jsonb default '[]'::jsonb;

-- ═══════════════════════════════════════════════════════════════
-- CONFIGURACIÓN — claves de texto editables desde el admin
-- Ejecutá en Supabase > SQL Editor si ya corriste el script anterior
-- ═══════════════════════════════════════════════════════════════

insert into configuracion (clave, valor) values
  -- Textos de la página de Inicio
  ('inicio_hero_subtitulo',  'Diseño de Interiores · Asunción, Paraguay'),
  ('inicio_hero_titulo',     'Espacios con alma'),
  ('inicio_hero_descripcion','Transformamos ambientes en experiencias únicas, con atención meticulosa al detalle y un diseño que refleja quien sos.'),
  ('inicio_intro_titulo',    'El lujo está en los detalles'),
  ('inicio_intro_texto',     'En Íntima Studio creemos que cada espacio tiene su propia esencia. Trabajamos para descubrirla, potenciarla y traducirla en un diseño que va más allá de lo estético.\nNuestro proceso es completamente personalizado. Desde la primera conversación hasta la entrega final, estamos con vos en cada decisión.'),
  ('inicio_cta_titulo',      'Hablemos de tu espacio'),
  ('inicio_cta_descripcion', 'Cada gran proyecto empieza con una conversación. Contanos qué tenés en mente y te responderemos a la brevedad.'),
  -- Textos de la página Nosotros
  ('nosotros_intro',         'Íntima Studio nació de la convicción de que los espacios en los que vivimos y trabajamos nos moldean tanto como nosotros a ellos.'),
  ('nosotros_descripcion',   'Somos un estudio boutique especializado en diseño de interiores residencial y comercial. Creemos en el diseño que surge del diálogo profundo con cada cliente.\nCada proyecto es único porque cada persona lo es. No trabajamos con fórmulas prefabricadas: entendemos tu estilo de vida, tus gustos y tus necesidades antes de trazar la primera línea.\nNos destacamos por un proceso de diseño transparente, una comunicación constante y un resultado que supera las expectativas.'),
  ('nosotros_stat_1_num',    '+50'),
  ('nosotros_stat_1_label',  'Proyectos realizados'),
  ('nosotros_stat_2_num',    '5+'),
  ('nosotros_stat_2_label',  'Años de experiencia'),
  -- Textos de la página Contacto
  ('contacto_email',         'hola@intimastudio.com'),
  ('contacto_instagram',     'intima.studio'),
  ('contacto_ubicacion',     'Asunción, Paraguay'),
  -- El Taller — tipos de muebles (JSON)
  ('taller_tipos',           '[{"imagen_url":"","nombre":"Mesas & Escritorios","desc":"Comedor, centro, auxiliares y escritorios de trabajo."},{"imagen_url":"","nombre":"Módulos & Estanterías","desc":"Bibliotecas, aparadores, módulos de TV y walk-in closets."},{"imagen_url":"","nombre":"Sillas & Sillones","desc":"Asientos de diseño con tapizados exclusivos."},{"imagen_url":"","nombre":"Camas & Cabeceras","desc":"Plataformas y cabeceras tapizadas o en madera."},{"imagen_url":"","nombre":"Baños & Vanitorios","desc":"Muebles de baño a medida con materiales resistentes."},{"imagen_url":"","nombre":"Piezas de exterior","desc":"Mobiliario para terrazas y espacios al aire libre."}]')
on conflict (clave) do nothing;
