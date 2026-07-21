// ─── Auth & Profiles ──────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'manager' | 'developer' | 'viewer'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  created_at: string
}

// ─── Leads ────────────────────────────────────────────────────────────────────
export type LeadStatus =
  | 'nuevo'
  | 'contactado'
  | 'propuesta_enviada'
  | 'negociacion'
  | 'ganado'
  | 'perdido'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string | null
  status: LeadStatus
  created_at: string
}

// ─── Clients ──────────────────────────────────────────────────────────────────
export interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  notes: string | null
  created_at: string
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export type ProjectStatus = 'Pendiente' | 'En Desarrollo' | 'En Revisión' | 'Entregado'

export interface Project {
  id: string
  client_id: string
  client?: Client
  name: string
  description: string | null
  status: ProjectStatus
  budget: number | null
  start_date: string | null
  end_date: string | null
  created_at: string
}

// ─── Tasks ────────────────────────────────────────────────────────────────────
export type TaskStatus = 'Pendiente' | 'En progreso' | 'Bloqueada' | 'Completada'
export type TaskPriority = 'baja' | 'media' | 'alta' | 'urgente'

export interface Task {
  id: string
  project_id: string | null
  project?: Project
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  assigned_to: string | null
  created_at: string
}

// ─── Quotes / Presupuestos ────────────────────────────────────────────────────
export type QuoteStatus = 'Borrador' | 'Enviado' | 'Aceptado' | 'Rechazado'

export interface Quote {
  id: string
  client_id: string
  client?: Client
  title: string
  amount: number
  status: QuoteStatus
  created_at: string
}

// ─── Files ────────────────────────────────────────────────────────────────────
export interface FileRecord {
  id: string
  project_id: string | null
  project?: Project
  file_name: string
  file_url: string
  uploaded_by: string | null
  created_at: string
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
  totalLeads: number
  newLeads: number
  activeClients: number
  activeProjects: number
  pendingQuotes: number
}
