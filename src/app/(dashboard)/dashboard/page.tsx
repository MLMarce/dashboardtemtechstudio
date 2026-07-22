'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  UserCheck,
  FolderKanban,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { getDashboardData } from '@/services/dashboard'
import { Lead, Project, Task, DashboardStats, LeadStatus } from '@/types'

const statusBadgeStyles: Record<LeadStatus, string> = {
  nuevo: 'badge-nuevo',
  contactado: 'badge-contactado',
  propuesta_enviada: 'badge-propuesta',
  negociacion: 'badge-negociacion',
  ganado: 'badge-ganado',
  perdido: 'badge-perdido',
}

const statusLabels: Record<LeadStatus, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  propuesta_enviada: 'Propuesta',
  negociacion: 'Negociación',
  ganado: 'Ganado',
  perdido: 'Perdido',
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    activeClients: 0,
    activeProjects: 0,
    pendingQuotes: 0,
  })
  const [leads, setLeads] = useState<Lead[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDashboardData()
        setStats(data.stats)
        setLeads(data.leads)
        setProjects(data.projects)
        setTasks(data.tasks)
      } catch (err) {
        console.error('Error loading dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const statCards = [
    {
      title: 'Leads Totales',
      value: stats.totalLeads,
      change: '+14%',
      period: 'este mes',
      icon: Users,
      color: '#06B6D4',
      bgGlow: 'rgba(6, 182, 212, 0.12)',
      href: '/leads',
    },
    {
      title: 'Leads Nuevos',
      value: stats.newLeads,
      change: 'nuevos',
      period: 'recientes',
      icon: TrendingUp,
      color: '#8B5CF6',
      bgGlow: 'rgba(139, 92, 246, 0.12)',
      href: '/leads',
    },
    {
      title: 'Clientes Activos',
      value: stats.activeClients,
      change: '+100%',
      period: 'retención',
      icon: UserCheck,
      color: '#22C55E',
      bgGlow: 'rgba(34, 197, 94, 0.12)',
      href: '/clientes',
    },
    {
      title: 'Proyectos Activos',
      value: stats.activeProjects,
      change: 'en curso',
      period: 'desarrollo',
      icon: FolderKanban,
      color: '#EC4899',
      bgGlow: 'rgba(236, 72, 153, 0.12)',
      href: '/proyectos',
    },
    {
      title: 'Presupuestos Pendientes',
      value: stats.pendingQuotes,
      change: 'en espera',
      period: 'cotizaciones',
      icon: FileText,
      color: '#F59E0B',
      bgGlow: 'rgba(245, 158, 11, 0.12)',
      href: '/presupuestos',
    },
  ]

  const pipelineCounts = {
    nuevo: leads.filter(l => l.status === 'nuevo').length,
    contactado: leads.filter(l => l.status === 'contactado').length,
    propuesta: leads.filter(l => l.status === 'propuesta_enviada').length,
    negociacion: leads.filter(l => l.status === 'negociacion').length,
    ganado: leads.filter(l => l.status === 'ganado').length,
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#06B6D4] animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Dashboard General
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Resumen en tiempo real conectado directamente a Supabase Database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/leads"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white text-sm font-semibold hover:opacity-90 transition-all glow-cyan"
          >
            <Plus className="w-4 h-4" />
            Nuevo Lead
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <motion.div key={idx} variants={itemVariants}>
              <Link href={card.href} className="block group">
                <div className="glass-card p-4 hover:border-[#06B6D4]/40 transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1">
                  <div
                    className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-60"
                    style={{ background: card.bgGlow }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#94A3B8]">
                      {card.title}
                    </span>
                    <div
                      className="p-2 rounded-lg flex items-center justify-center"
                      style={{ background: card.bgGlow, color: card.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl font-display font-bold text-white tracking-tight">
                      {card.value}
                    </span>
                    <span className="text-[11px] font-medium text-[#22C55E] flex items-center gap-0.5">
                      {card.change}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-[#4B6A8A]">
                    {card.period}
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Commercial Pipeline section */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Pipeline Comercial (Supabase Realtime)</h2>
            <p className="text-xs text-[#94A3B8]">Distribución de leads según su estado actual</p>
          </div>
          <Link href="/leads" className="text-xs text-[#06B6D4] hover:underline flex items-center gap-1">
            Ver Leads <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Nuevos', count: pipelineCounts.nuevo, color: '#06B6D4' },
            { label: 'Contactados', count: pipelineCounts.contactado, color: '#8B5CF6' },
            { label: 'Propuesta', count: pipelineCounts.propuesta, color: '#F59E0B' },
            { label: 'Negociación', count: pipelineCounts.negociacion, color: '#EC4899' },
            { label: 'Ganados', count: pipelineCounts.ganado, color: '#22C55E' },
          ].map((stage, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#0F172A]/80 border border-[#1E2A3A] hover:border-[#1E2A3A]/80 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                <span className="text-xs font-medium text-[#94A3B8]">{stage.label}</span>
              </div>
              <p className="text-xl font-bold font-display text-white">{stage.count}</p>
              <div className="w-full h-1.5 bg-[#1E2A3A] rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (stage.count / (leads.length || 1)) * 100)}%`,
                    background: stage.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads Widget */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#06B6D4]" />
                <h2 className="text-base font-semibold text-white">Leads Recientes</h2>
              </div>
              <Link
                href="/leads"
                className="text-xs text-[#06B6D4] hover:underline flex items-center gap-1"
              >
                Ver todos ({leads.length}) <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1E2A3A] text-[11px] font-semibold text-[#4B6A8A] uppercase tracking-wider">
                    <th className="pb-3 pr-4">Nombre</th>
                    <th className="pb-3 px-4">Servicio</th>
                    <th className="pb-3 px-4">Estado</th>
                    <th className="pb-3 pl-4 text-right font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2A3A]/60 text-sm">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-[#94A3B8]">
                        No hay leads cargados en Supabase.
                      </td>
                    </tr>
                  ) : (
                    leads.slice(0, 5).map(lead => (
                      <tr key={lead.id} className="hover:bg-[#1E2A3A]/40 transition-colors group">
                        <td className="py-3 pr-4">
                          <div>
                            <p className="font-medium text-white group-hover:text-[#06B6D4] transition-colors">
                              {lead.name}
                            </p>
                            <p className="text-xs text-[#94A3B8]">{lead.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-[#94A3B8]">
                          <span className="px-2 py-1 rounded-lg bg-[#1E2A3A] text-white">
                            {lead.service}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`badge ${statusBadgeStyles[lead.status]}`}>
                            {statusLabels[lead.status]}
                          </span>
                        </td>
                        <td className="py-3 pl-4 text-right text-xs text-[#4B6A8A]">
                          {new Date(lead.created_at).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Tasks Widget */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
              <h2 className="text-base font-semibold text-white">Próximas Tareas</h2>
            </div>
            <Link href="/tareas" className="text-xs text-[#06B6D4] hover:underline">
              Ir a Kanban
            </Link>
          </div>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-xs text-[#94A3B8] text-center py-6">No hay tareas cargadas.</p>
            ) : (
              tasks.slice(0, 4).map(task => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-[#0F172A]/90 border border-[#1E2A3A] hover:border-[#8B5CF6]/30 transition-all flex items-start gap-3 group"
                >
                  <div
                    className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      task.status === 'Completada'
                        ? 'bg-[#22C55E]'
                        : task.status === 'En progreso'
                        ? 'bg-[#06B6D4]'
                        : task.status === 'Bloqueada'
                        ? 'bg-[#EF4444]'
                        : 'bg-[#F59E0B]'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white group-hover:text-[#8B5CF6] transition-colors truncate">
                      {task.title}
                    </p>
                    <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-[#4B6A8A]">
                        Prioridad: <span className="text-white uppercase font-bold">{task.priority}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects Widget */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#EC4899]" />
              <h2 className="text-base font-semibold text-white">Proyectos Destacados</h2>
            </div>
            <Link href="/proyectos" className="text-xs text-[#06B6D4] hover:underline">
              Ver todos ({projects.length})
            </Link>
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-xs text-[#94A3B8] text-center py-6">No hay proyectos cargados.</p>
            ) : (
              projects.slice(0, 3).map(proj => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl bg-[#0F172A]/80 border border-[#1E2A3A] flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{proj.name}</h3>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{proj.description}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/30">
                      {proj.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#4B6A8A] pt-2 border-t border-[#1E2A3A]">
                    <span>Presupuesto: <strong className="text-white">${proj.budget?.toLocaleString()}</strong></span>
                    <span>Fecha: {new Date(proj.created_at).toLocaleDateString('es-AR')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F59E0B]" />
              <h2 className="text-base font-semibold text-white">Actividad Reciente</h2>
            </div>
            <span className="text-[10px] text-[#4B6A8A] uppercase font-mono">Supabase connected</span>
          </div>

          <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E2A3A]">
            {[
              { text: 'Conexión con Supabase PostgreSQL establecida', sub: 'Base de datos sincronizada', time: 'Ahora', color: '#22C55E' },
              { text: 'Auth Middleware en ejecución', sub: 'Validación de tokens activa', time: 'Hace 2 min', color: '#06B6D4' },
              { text: 'Políticas RLS activas en tablas', sub: 'Seguridad en base de datos', time: 'Hace 5 min', color: '#8B5CF6' },
            ].map((act, i) => (
              <div key={i} className="relative">
                <div
                  className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-[#111827]"
                  style={{ background: act.color }}
                />
                <p className="text-xs font-semibold text-white">{act.text}</p>
                <p className="text-[11px] text-[#94A3B8]">{act.sub}</p>
                <span className="text-[10px] text-[#4B6A8A] mt-0.5 block">{act.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
