import { createClient } from '@/lib/supabase/client'
import { DashboardStats, Lead, Project, Task, Quote } from '@/types'

const supabase = createClient()

export async function getDashboardData() {
  const [leadsRes, clientsRes, projectsRes, tasksRes, quotesRes] = await Promise.all([
    supabase.from('leads').select('*').order('created_at', { ascending: false }),
    supabase.from('clients').select('*').order('created_at', { ascending: false }),
    supabase.from('projects').select('*, client:clients(*)').order('created_at', { ascending: false }),
    supabase.from('tasks').select('*, project:projects(*)').order('created_at', { ascending: false }),
    supabase.from('quotes').select('*, client:clients(*)').order('created_at', { ascending: false }),
  ])

  const leads = (leadsRes.data || []) as Lead[]
  const clients = (clientsRes.data || [])
  const projects = (projectsRes.data || []) as Project[]
  const tasks = (tasksRes.data || []) as Task[]
  const quotes = (quotesRes.data || []) as Quote[]

  const stats: DashboardStats = {
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === 'nuevo').length,
    activeClients: clients.length,
    activeProjects: projects.filter(p => p.status !== 'Entregado').length,
    pendingQuotes: quotes.filter(q => q.status === 'Borrador' || q.status === 'Enviado').length,
  }

  return {
    stats,
    leads,
    clients,
    projects,
    tasks,
    quotes,
  }
}
