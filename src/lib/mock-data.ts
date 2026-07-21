import type {
  Lead,
  Client,
  Project,
  Task,
  Quote,
  FileRecord,
  DashboardStats,
} from '@/types'

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockLeads: Lead[] = [
  { id: '1', name: 'Matías Fernández', email: 'matias@empresa.com', phone: '+54 9 11 4567-8901', service: 'Desarrollo Web', message: 'Necesito un ecommerce completo', status: 'nuevo', created_at: '2026-07-18T10:00:00Z' },
  { id: '2', name: 'Laura González', email: 'laura@startup.io', phone: '+54 9 11 2345-6789', service: 'App Móvil', message: 'App iOS y Android para delivery', status: 'contactado', created_at: '2026-07-17T14:30:00Z' },
  { id: '3', name: 'Carlos Ruiz', email: 'carlos@ruiz.com', phone: '+54 9 11 8901-2345', service: 'Branding', message: 'Rediseño de identidad corporativa', status: 'propuesta_enviada', created_at: '2026-07-16T09:15:00Z' },
  { id: '4', name: 'Valentina Torres', email: 'valen@corp.com', phone: '+54 9 11 3456-7890', service: 'SEO & Marketing', message: 'Posicionamiento en Google', status: 'negociacion', created_at: '2026-07-15T11:00:00Z' },
  { id: '5', name: 'Diego Martínez', email: 'diego@pyme.ar', phone: '+54 9 11 6789-0123', service: 'Desarrollo Web', message: 'Landing page para mi negocio', status: 'ganado', created_at: '2026-07-14T08:00:00Z' },
  { id: '6', name: 'Ana López', email: 'ana@ejemplo.com', phone: '+54 9 11 0123-4567', service: 'Diseño UI/UX', message: 'Rediseño de plataforma interna', status: 'perdido', created_at: '2026-07-13T16:45:00Z' },
  { id: '7', name: 'Roberto Sánchez', email: 'roberto@digital.com', phone: '+54 9 11 5678-9012', service: 'App Móvil', message: 'App de gestión interna', status: 'nuevo', created_at: '2026-07-19T10:00:00Z' },
  { id: '8', name: 'Florencia Méndez', email: 'flor@creativa.com', phone: '+54 9 11 9012-3456', service: 'Branding', message: 'Logo y manual de marca', status: 'contactado', created_at: '2026-07-20T09:30:00Z' },
]

export const mockClients: Client[] = [
  { id: '1', name: 'Diego Martínez', company: 'Pyme Digital AR', email: 'diego@pyme.ar', phone: '+54 9 11 6789-0123', notes: 'Cliente muy activo, paga puntual', created_at: '2026-06-01T00:00:00Z' },
  { id: '2', name: 'Empresa TechCorp', company: 'TechCorp SRL', email: 'contacto@techcorp.com', phone: '+54 9 11 1111-2222', notes: null, created_at: '2026-05-15T00:00:00Z' },
  { id: '3', name: 'StartupX', company: 'StartupX SA', email: 'hola@startupx.io', phone: '+54 9 11 3333-4444', notes: 'Necesita soporte continuo', created_at: '2026-04-20T00:00:00Z' },
  { id: '4', name: 'Maria Paz Giménez', company: 'MKT Solutions', email: 'mpaz@mktsolutions.com', phone: '+54 9 11 5555-6666', notes: null, created_at: '2026-03-10T00:00:00Z' },
]

export const mockProjects: Project[] = [
  { id: '1', client_id: '1', name: 'Ecommerce Pyme Digital', description: 'Tienda online con pasarela de pagos', status: 'En Desarrollo', budget: 150000, start_date: '2026-06-15', end_date: '2026-08-30', created_at: '2026-06-15T00:00:00Z' },
  { id: '2', client_id: '2', name: 'Dashboard TechCorp', description: 'Panel de gestión interno', status: 'En Revisión', budget: 200000, start_date: '2026-05-01', end_date: '2026-07-31', created_at: '2026-05-01T00:00:00Z' },
  { id: '3', client_id: '3', name: 'App StartupX v2', description: 'Rediseño y nuevas features', status: 'Pendiente', budget: 80000, start_date: '2026-08-01', end_date: '2026-10-31', created_at: '2026-07-01T00:00:00Z' },
  { id: '4', client_id: '4', name: 'Campaña MKT Q3', description: 'Estrategia de marketing digital', status: 'Entregado', budget: 45000, start_date: '2026-04-01', end_date: '2026-06-30', created_at: '2026-04-01T00:00:00Z' },
  { id: '5', client_id: '1', name: 'App Móvil Pyme', description: 'App complementaria al ecommerce', status: 'Pendiente', budget: 120000, start_date: '2026-09-01', end_date: '2026-12-31', created_at: '2026-07-10T00:00:00Z' },
]

export const mockTasks: Task[] = [
  { id: '1', project_id: '1', title: 'Diseño de wireframes', description: 'Crear wireframes para todas las pantallas', status: 'Completada', priority: 'alta', assigned_to: null, created_at: '2026-06-16T00:00:00Z' },
  { id: '2', project_id: '1', title: 'Desarrollo frontend', description: 'Implementar diseño en React', status: 'En progreso', priority: 'alta', assigned_to: null, created_at: '2026-06-20T00:00:00Z' },
  { id: '3', project_id: '1', title: 'Integración Mercado Pago', description: 'Conectar pasarela de pagos', status: 'Pendiente', priority: 'urgente', assigned_to: null, created_at: '2026-07-01T00:00:00Z' },
  { id: '4', project_id: '2', title: 'Diseño del sistema', description: 'Arquitectura del dashboard', status: 'Completada', priority: 'media', assigned_to: null, created_at: '2026-05-02T00:00:00Z' },
  { id: '5', project_id: '2', title: 'Testing QA', description: 'Pruebas de calidad', status: 'En progreso', priority: 'alta', assigned_to: null, created_at: '2026-07-10T00:00:00Z' },
  { id: '6', project_id: '3', title: 'Relevamiento de requisitos', description: 'Reuniones con el cliente', status: 'Pendiente', priority: 'media', assigned_to: null, created_at: '2026-07-15T00:00:00Z' },
  { id: '7', project_id: '1', title: 'Deploy en producción', description: 'Subir a servidor', status: 'Bloqueada', priority: 'urgente', assigned_to: null, created_at: '2026-07-18T00:00:00Z' },
]

export const mockQuotes: Quote[] = [
  { id: '1', client_id: '3', title: 'Propuesta App StartupX v2', amount: 80000, status: 'Enviado', created_at: '2026-07-05T00:00:00Z' },
  { id: '2', client_id: '4', title: 'Campaña MKT Q4', amount: 55000, status: 'Borrador', created_at: '2026-07-15T00:00:00Z' },
  { id: '3', client_id: '1', title: 'App Móvil complementaria', amount: 120000, status: 'Aceptado', created_at: '2026-07-10T00:00:00Z' },
  { id: '4', client_id: '2', title: 'Mantenimiento anual TechCorp', amount: 36000, status: 'Rechazado', created_at: '2026-07-01T00:00:00Z' },
  { id: '5', client_id: '1', title: 'Módulo de analytics', amount: 25000, status: 'Borrador', created_at: '2026-07-20T00:00:00Z' },
]

export const mockFiles: FileRecord[] = [
  { id: '1', project_id: '1', file_name: 'brief-ecommerce.pdf', file_url: '#', uploaded_by: null, created_at: '2026-06-15T00:00:00Z' },
  { id: '2', project_id: '1', file_name: 'mockups-v2.zip', file_url: '#', uploaded_by: null, created_at: '2026-06-25T00:00:00Z' },
  { id: '3', project_id: '2', file_name: 'propuesta-techcorp.docx', file_url: '#', uploaded_by: null, created_at: '2026-05-10T00:00:00Z' },
  { id: '4', project_id: '4', file_name: 'reporte-mkt-q3.pdf', file_url: '#', uploaded_by: null, created_at: '2026-07-01T00:00:00Z' },
  { id: '5', project_id: '2', file_name: 'logo-techcorp.png', file_url: '#', uploaded_by: null, created_at: '2026-05-20T00:00:00Z' },
]

export const mockDashboardStats: DashboardStats = {
  totalLeads: mockLeads.length,
  newLeads: mockLeads.filter(l => l.status === 'nuevo').length,
  activeClients: mockClients.length,
  activeProjects: mockProjects.filter(p => p.status !== 'Entregado').length,
  pendingQuotes: mockQuotes.filter(q => q.status === 'Borrador' || q.status === 'Enviado').length,
}
