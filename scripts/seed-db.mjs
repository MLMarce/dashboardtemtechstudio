import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xrdqafjbymdmxznltbrk.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZHFhZmpieW1kbXh6bmx0YnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2Njc5MjUsImV4cCI6MjEwMDI0MzkyNX0.SRrluuwMnWaLlhkvohrMKet8Iz8guFbkoPa46M6W43A'

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('Seeding Supabase database...')

  // 1. Clients
  const clients = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Diego Martínez', company: 'Pyme Digital AR', email: 'diego@pyme.ar', phone: '+54 9 11 6789-0123', notes: 'Cliente muy activo, paga puntual' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Empresa TechCorp', company: 'TechCorp SRL', email: 'contacto@techcorp.com', phone: '+54 9 11 1111-2222', notes: 'Requiere atención personalizada' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'StartupX', company: 'StartupX SA', email: 'hola@startupx.io', phone: '+54 9 11 3333-4444', notes: 'Necesita soporte continuo' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'Maria Paz Giménez', company: 'MKT Solutions', email: 'mpaz@mktsolutions.com', phone: '+54 9 11 5555-6666', notes: 'Interesada en servicios de marketing digital' },
  ]
  const { error: clientsError } = await supabase.from('clients').upsert(clients)
  if (clientsError) console.error('Clients error:', clientsError.message)
  else console.log('✓ Clients seeded')

  // 2. Leads
  const leads = [
    { id: 'a1111111-1111-1111-1111-111111111111', name: 'Matías Fernández', email: 'matias@empresa.com', phone: '+54 9 11 4567-8901', service: 'Desarrollo Web', message: 'Necesito un ecommerce completo con pasarela de pago', status: 'nuevo' },
    { id: 'a2222222-2222-2222-2222-222222222222', name: 'Laura González', email: 'laura@startup.io', phone: '+54 9 11 2345-6789', service: 'App Móvil', message: 'App iOS y Android para delivery de comida', status: 'contactado' },
    { id: 'a3333333-3333-3333-3333-333333333333', name: 'Carlos Ruiz', email: 'carlos@ruiz.com', phone: '+54 9 11 8901-2345', service: 'Branding', message: 'Rediseño completo de identidad corporativa', status: 'propuesta_enviada' },
    { id: 'a4444444-4444-4444-4444-444444444444', name: 'Valentina Torres', email: 'valen@corp.com', phone: '+54 9 11 3456-7890', service: 'SEO & Marketing', message: 'Posicionamiento orgánico en Google para 10 palabras clave', status: 'negociacion' },
    { id: 'a5555555-5555-5555-5555-555555555555', name: 'Diego Martínez', email: 'diego@pyme.ar', phone: '+54 9 11 6789-0123', service: 'Desarrollo Web', message: 'Landing page orientada a ventas para mi negocio', status: 'ganado' },
    { id: 'a6666666-6666-6666-6666-666666666666', name: 'Ana López', email: 'ana@ejemplo.com', phone: '+54 9 11 0123-4567', service: 'Diseño UI/UX', message: 'Rediseño UX/UI de plataforma interna', status: 'perdido' },
    { id: 'a7777777-7777-7777-7777-777777777777', name: 'Roberto Sánchez', email: 'roberto@digital.com', phone: '+54 9 11 5678-9012', service: 'App Móvil', message: 'App de gestión de inventario y personal', status: 'nuevo' },
    { id: 'a8888888-8888-8888-8888-888888888888', name: 'Florencia Méndez', email: 'flor@creativa.com', phone: '+54 9 11 9012-3456', service: 'Branding', message: 'Logo y manual de marca profesional', status: 'contactado' },
  ]
  const { error: leadsError } = await supabase.from('leads').upsert(leads)
  if (leadsError) console.error('Leads error:', leadsError.message)
  else console.log('✓ Leads seeded')

  // 3. Projects
  const projects = [
    { id: 'b1111111-1111-1111-1111-111111111111', client_id: '11111111-1111-1111-1111-111111111111', name: 'Ecommerce Pyme Digital', description: 'Tienda online completa con pasarela Mercado Pago', status: 'En Desarrollo', budget: 150000 },
    { id: 'b2222222-2222-2222-2222-222222222222', client_id: '22222222-2222-2222-2222-222222222222', name: 'Dashboard TechCorp', description: 'Panel de gestión y analítica interna para empleados', status: 'En Revisión', budget: 200000 },
    { id: 'b3333333-3333-3333-3333-333333333333', client_id: '33333333-3333-3333-3333-333333333333', name: 'App StartupX v2', description: 'Rediseño completo de la aplicación móvil v2', status: 'Pendiente', budget: 80000 },
    { id: 'b4444444-4444-4444-4444-444444444444', client_id: '44444444-4444-4444-4444-444444444444', name: 'Campaña MKT Q3', description: 'Estrategia integral de marketing digital y performance', status: 'Entregado', budget: 45000 },
    { id: 'b5555555-5555-5555-5555-555555555555', client_id: '11111111-1111-1111-1111-111111111111', name: 'App Móvil Pyme', description: 'Aplicación móvil iOS y Android complementaria', status: 'Pendiente', budget: 120000 },
  ]
  const { error: projectsError } = await supabase.from('projects').upsert(projects)
  if (projectsError) console.error('Projects error:', projectsError.message)
  else console.log('✓ Projects seeded')

  // 4. Tasks
  const tasks = [
    { id: 'c1111111-1111-1111-1111-111111111111', project_id: 'b1111111-1111-1111-1111-111111111111', title: 'Diseño de wireframes', description: 'Crear wireframes para todas las pantallas del ecommerce', status: 'Completada', priority: 'alta' },
    { id: 'c2222222-2222-2222-2222-222222222222', project_id: 'b1111111-1111-1111-1111-111111111111', title: 'Desarrollo frontend', description: 'Implementar catálogo y carrito en Next.js', status: 'En progreso', priority: 'alta' },
    { id: 'c3333333-3333-3333-3333-333333333333', project_id: 'b1111111-1111-1111-1111-111111111111', title: 'Integración Mercado Pago', description: 'Conectar la pasarela de pagos webhook y checkout', status: 'Pendiente', priority: 'urgente' },
    { id: 'c4444444-4444-4444-4444-444444444444', project_id: 'b2222222-2222-2222-2222-222222222222', title: 'Diseño del sistema', description: 'Definir arquitectura de base de datos y API', status: 'Completada', priority: 'media' },
    { id: 'c5555555-5555-5555-5555-555555555555', project_id: 'b2222222-2222-2222-2222-222222222222', title: 'Testing QA', description: 'Pruebas de estrés y seguridad en endpoints', status: 'En progreso', priority: 'alta' },
    { id: 'c6666666-6666-6666-6666-666666666666', project_id: 'b3333333-3333-3333-3333-333333333333', title: 'Relevamiento de requisitos', description: 'Reunión de alineación con el equipo directivo', status: 'Pendiente', priority: 'media' },
    { id: 'c7777777-7777-7777-7777-777777777777', project_id: 'b1111111-1111-1111-1111-111111111111', title: 'Deploy en producción', description: 'Configurar dominio y SSL en servidor cloud', status: 'Bloqueada', priority: 'urgente' },
  ]
  const { error: tasksError } = await supabase.from('tasks').upsert(tasks)
  if (tasksError) console.error('Tasks error:', tasksError.message)
  else console.log('✓ Tasks seeded')

  // 5. Quotes
  const quotes = [
    { id: 'd1111111-1111-1111-1111-111111111111', client_id: '33333333-3333-3333-3333-333333333333', title: 'Propuesta App StartupX v2', amount: 80000, status: 'Enviado' },
    { id: 'd2222222-2222-2222-2222-222222222222', client_id: '44444444-4444-4444-4444-444444444444', title: 'Campaña MKT Q4', amount: 55000, status: 'Borrador' },
    { id: 'd3333333-3333-3333-3333-333333333333', client_id: '11111111-1111-1111-1111-111111111111', title: 'App Móvil complementaria', amount: 120000, status: 'Aceptado' },
    { id: 'd4444444-4444-4444-4444-444444444444', client_id: '22222222-2222-2222-2222-222222222222', title: 'Mantenimiento anual TechCorp', amount: 36000, status: 'Rechazado' },
    { id: 'd5555555-5555-5555-5555-555555555555', client_id: '11111111-1111-1111-1111-111111111111', title: 'Módulo de analytics personalizado', amount: 25000, status: 'Borrador' },
  ]
  const { error: quotesError } = await supabase.from('quotes').upsert(quotes)
  if (quotesError) console.error('Quotes error:', quotesError.message)
  else console.log('✓ Quotes seeded')

  // 6. Files
  const files = [
    { id: 'e1111111-1111-1111-1111-111111111111', project_id: 'b1111111-1111-1111-1111-111111111111', file_name: 'brief-ecommerce.pdf', file_url: '#' },
    { id: 'e2222222-2222-2222-2222-222222222222', project_id: 'b1111111-1111-1111-1111-111111111111', file_name: 'mockups-v2.zip', file_url: '#' },
    { id: 'e3333333-3333-3333-3333-333333333333', project_id: 'b2222222-2222-2222-2222-222222222222', file_name: 'propuesta-techcorp.docx', file_url: '#' },
    { id: 'e4444444-4444-4444-4444-444444444444', project_id: 'b4444444-4444-4444-4444-444444444444', file_name: 'reporte-mkt-q3.pdf', file_url: '#' },
    { id: 'e5555555-5555-5555-5555-555555555555', project_id: 'b2222222-2222-2222-2222-222222222222', file_name: 'logo-techcorp.png', file_url: '#' },
  ]
  const { error: filesError } = await supabase.from('files').upsert(files)
  if (filesError) console.error('Files error:', filesError.message)
  else console.log('✓ Files seeded')

  console.log('Seeding complete!')
}

seed().catch(err => console.error(err))
