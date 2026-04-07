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
