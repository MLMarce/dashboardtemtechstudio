-- ─── TEMTECH Dashboard — SQL Seed Data ─────────────────────────────────────────
-- Execute this SQL in your Supabase SQL Editor AFTER executing 001_initial_schema.sql
-- to populate initial mock data into your database.

-- Clean existing mock data
TRUNCATE TABLE files, tasks, quotes, projects, leads, clients CASCADE;

-- ─── 1. Clients ───────────────────────────────────────────────────────────────
INSERT INTO clients (id, name, company, email, phone, notes, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Diego Martínez', 'Pyme Digital AR', 'diego@pyme.ar', '+54 9 11 6789-0123', 'Cliente muy activo, paga puntual', '2026-06-01T00:00:00Z'),
  ('22222222-2222-2222-2222-222222222222', 'Empresa TechCorp', 'TechCorp SRL', 'contacto@techcorp.com', '+54 9 11 1111-2222', 'Requiere atención personalizada', '2026-05-15T00:00:00Z'),
  ('33333333-3333-3333-3333-333333333333', 'StartupX', 'StartupX SA', 'hola@startupx.io', '+54 9 11 3333-4444', 'Necesita soporte continuo', '2026-04-20T00:00:00Z'),
  ('44444444-4444-4444-4444-444444444444', 'Maria Paz Giménez', 'MKT Solutions', 'mpaz@mktsolutions.com', '+54 9 11 5555-6666', 'Interesada en servicios de marketing digital', '2026-03-10T00:00:00Z');

-- ─── 2. Leads ─────────────────────────────────────────────────────────────────
INSERT INTO leads (id, name, email, phone, service, message, status, created_at) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Matías Fernández', 'matias@empresa.com', '+54 9 11 4567-8901', 'Desarrollo Web', 'Necesito un ecommerce completo con pasarela de pago', 'nuevo', '2026-07-18T10:00:00Z'),
  ('a2222222-2222-2222-2222-222222222222', 'Laura González', 'laura@startup.io', '+54 9 11 2345-6789', 'App Móvil', 'App iOS y Android para delivery de comida', 'contactado', '2026-07-17T14:30:00Z'),
  ('a3333333-3333-3333-3333-333333333333', 'Carlos Ruiz', 'carlos@ruiz.com', '+54 9 11 8901-2345', 'Branding', 'Rediseño completo de identidad corporativa', 'propuesta_enviada', '2026-07-16T09:15:00Z'),
  ('a4444444-4444-4444-4444-444444444444', 'Valentina Torres', 'valen@corp.com', '+54 9 11 3456-7890', 'SEO & Marketing', 'Posicionamiento orgánico en Google para 10 palabras clave', 'negociacion', '2026-07-15T11:00:00Z'),
  ('a5555555-5555-5555-5555-555555555555', 'Diego Martínez', 'diego@pyme.ar', '+54 9 11 6789-0123', 'Desarrollo Web', 'Landing page orientada a ventas para mi negocio', 'ganado', '2026-07-14T08:00:00Z'),
  ('a6666666-6666-6666-6666-666666666666', 'Ana López', 'ana@ejemplo.com', '+54 9 11 0123-4567', 'Diseño UI/UX', 'Rediseño UX/UI de plataforma interna', 'perdido', '2026-07-13T16:45:00Z'),
  ('a7777777-7777-7777-7777-777777777777', 'Roberto Sánchez', 'roberto@digital.com', '+54 9 11 5678-9012', 'App Móvil', 'App de gestión de inventario y personal', 'nuevo', '2026-07-19T10:00:00Z'),
  ('a8888888-8888-8888-8888-888888888888', 'Florencia Méndez', 'flor@creativa.com', '+54 9 11 9012-3456', 'Branding', 'Logo y manual de marca profesional', 'contactado', '2026-07-20T09:30:00Z');

-- ─── 3. Projects ──────────────────────────────────────────────────────────────
INSERT INTO projects (id, client_id, name, description, status, budget, start_date, end_date, created_at) VALUES
  ('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Ecommerce Pyme Digital', 'Tienda online completa con pasarela Mercado Pago', 'En Desarrollo', 150000, '2026-06-15', '2026-08-30', '2026-06-15T00:00:00Z'),
  ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Dashboard TechCorp', 'Panel de gestión y analítica interna para empleados', 'En Revisión', 200000, '2026-05-01', '2026-07-31', '2026-05-01T00:00:00Z'),
  ('b3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'App StartupX v2', 'Rediseño completo de la aplicación móvil v2', 'Pendiente', 80000, '2026-08-01', '2026-10-31', '2026-07-01T00:00:00Z'),
  ('b4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Campaña MKT Q3', 'Estrategia integral de marketing digital y performance', 'Entregado', 45000, '2026-04-01', '2026-06-30', '2026-04-01T00:00:00Z'),
  ('b5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'App Móvil Pyme', 'Aplicación móvil iOS y Android complementaria', 'Pendiente', 120000, '2026-09-01', '2026-12-31', '2026-07-10T00:00:00Z');

-- ─── 4. Tasks ─────────────────────────────────────────────────────────────────
INSERT INTO tasks (id, project_id, title, description, status, priority, created_at) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Diseño de wireframes', 'Crear wireframes para todas las pantallas del ecommerce', 'Completada', 'alta', '2026-06-16T00:00:00Z'),
  ('c2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'Desarrollo frontend', 'Implementar catálogo y carrito en Next.js', 'En progreso', 'alta', '2026-06-20T00:00:00Z'),
  ('c3333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111', 'Integración Mercado Pago', 'Conectar la pasarela de pagos webhook y checkout', 'Pendiente', 'urgente', '2026-07-01T00:00:00Z'),
  ('c4444444-4444-4444-4444-444444444444', 'b2222222-2222-2222-2222-222222222222', 'Diseño del sistema', 'Definir arquitectura de base de datos y API', 'Completada', 'media', '2026-05-02T00:00:00Z'),
  ('c5555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', 'Testing QA', 'Pruebas de estrés y seguridad en endpoints', 'En progreso', 'alta', '2026-07-10T00:00:00Z'),
  ('c6666666-6666-6666-6666-666666666666', 'b3333333-3333-3333-3333-333333333333', 'Relevamiento de requisitos', 'Reunión de alineación con el equipo directivo', 'Pendiente', 'media', '2026-07-15T00:00:00Z'),
  ('c7777777-7777-7777-7777-777777777777', 'b1111111-1111-1111-1111-111111111111', 'Deploy en producción', 'Configurar dominio y SSL en servidor cloud', 'Bloqueada', 'urgente', '2026-07-18T00:00:00Z');

-- ─── 5. Quotes ────────────────────────────────────────────────────────────────
INSERT INTO quotes (id, client_id, title, amount, status, created_at) VALUES
  ('d1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Propuesta App StartupX v2', 80000, 'Enviado', '2026-07-05T00:00:00Z'),
  ('d2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Campaña MKT Q4', 55000, 'Borrador', '2026-07-15T00:00:00Z'),
  ('d3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'App Móvil complementaria', 120000, 'Aceptado', '2026-07-10T00:00:00Z'),
  ('d4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Mantenimiento anual TechCorp', 36000, 'Rechazado', '2026-07-01T00:00:00Z'),
  ('d5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Módulo de analytics personalizado', 25000, 'Borrador', '2026-07-20T00:00:00Z');

-- ─── 6. Files ─────────────────────────────────────────────────────────────────
INSERT INTO files (id, project_id, file_name, file_url, created_at) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'brief-ecommerce.pdf', '#', '2026-06-15T00:00:00Z'),
  ('e2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'mockups-v2.zip', '#', '2026-06-25T00:00:00Z'),
  ('e3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'propuesta-techcorp.docx', '#', '2026-05-10T00:00:00Z'),
  ('e4444444-4444-4444-4444-444444444444', 'b4444444-4444-4444-4444-444444444444', 'reporte-mkt-q3.pdf', '#', '2026-04-01T00:00:00Z'),
  ('e5555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', 'logo-techcorp.png', '#', '2026-05-20T00:00:00Z');
