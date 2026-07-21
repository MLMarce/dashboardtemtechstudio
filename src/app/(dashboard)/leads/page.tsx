'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  UserCheck,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  X,
  CheckCircle2,
} from 'lucide-react'
import { mockLeads, mockClients } from '@/lib/mock-data'
import { Lead, LeadStatus } from '@/types'

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
  propuesta_enviada: 'Propuesta Enviada',
  negociacion: 'Negociación',
  ganado: 'Ganado',
  perdido: 'Perdido',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    status: 'nuevo' as LeadStatus,
  })

  // Conversion notification toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.service.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      filterStatus === 'todos' || lead.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const openCreateModal = () => {
    setEditingLead(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: 'Desarrollo Web',
      message: '',
      status: 'nuevo',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead)
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      service: lead.service,
      message: lead.message || '',
      status: lead.status,
    })
    setIsModalOpen(true)
  }

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingLead) {
      // Update
      const updated = leads.map(l =>
        l.id === editingLead.id ? { ...l, ...formData } : l
      )
      setLeads(updated)
      
      // Auto convert to client if status set to 'ganado'
      if (formData.status === 'ganado' && editingLead.status !== 'ganado') {
        convertToClient({ ...editingLead, ...formData })
      } else {
        showToast('Lead actualizado con éxito')
      }
    } else {
      // Create
      const newLead: Lead = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
      }
      setLeads([newLead, ...leads])
      
      if (formData.status === 'ganado') {
        convertToClient(newLead)
      } else {
        showToast('Lead creado con éxito')
      }
    }
    setIsModalOpen(false)
  }

  const handleDeleteLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id))
    showToast('Lead eliminado')
  }

  const convertToClient = (lead: Lead) => {
    // 1. Create client record
    const newClient = {
      id: Date.now().toString(),
      name: lead.name,
      company: `${lead.name} Corp`,
      email: lead.email,
      phone: lead.phone,
      notes: `Convertido automáticamente desde Lead (${lead.service})`,
      created_at: new Date().toISOString(),
    }
    mockClients.push(newClient)

    // 2. Update lead status to 'ganado'
    setLeads(prev =>
      prev.map(l => (l.id === lead.id ? { ...l, status: 'ganado' } : l))
    )

    showToast(`¡Lead "${lead.name}" convertido a Cliente automáticamente!`)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] text-white font-semibold text-sm shadow-modal flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Gestión de Leads
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Captura, seguimiento y conversión de clientes potenciales.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-semibold text-sm hover:opacity-90 transition-all glow-cyan self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Crear Lead
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B6A8A]" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o servicio..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#4B6A8A] focus:outline-none focus:border-[#06B6D4]/50"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-[#4B6A8A] mr-1 hidden md:block" />
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'nuevo', label: 'Nuevos' },
            { id: 'contactado', label: 'Contactados' },
            { id: 'propuesta_enviada', label: 'Propuesta' },
            { id: 'negociacion', label: 'Negociación' },
            { id: 'ganado', label: 'Ganados' },
            { id: 'perdido', label: 'Perdidos' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? 'bg-[#06B6D4] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E2A3A] text-[11px] font-semibold text-[#4B6A8A] uppercase tracking-wider bg-[#0F172A]/50">
                <th className="py-3.5 px-4">Lead</th>
                <th className="py-3.5 px-4">Contacto</th>
                <th className="py-3.5 px-4">Servicio</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4">Fecha</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2A3A]/60 text-sm">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#94A3B8]">
                    No se encontraron leads con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-[#1E2A3A]/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-white group-hover:text-[#06B6D4] transition-colors">
                          {lead.name}
                        </p>
                        {lead.message && (
                          <p className="text-xs text-[#94A3B8] line-clamp-1 mt-0.5">
                            "{lead.message}"
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-xs text-[#94A3B8]">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#4B6A8A]" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#4B6A8A]" />
                          {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#1E2A3A] text-white text-xs font-medium">
                        {lead.service}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`badge ${statusBadgeStyles[lead.status]}`}>
                        {statusLabels[lead.status]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#4B6A8A]">
                      {new Date(lead.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {lead.status !== 'ganado' && (
                          <button
                            onClick={() => convertToClient(lead)}
                            title="Convertir a Cliente"
                            className="p-1.5 rounded-lg text-[#22C55E] hover:bg-[#22C55E]/10 transition-colors"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(lead)}
                          title="Editar"
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          title="Eliminar"
                          className="p-1.5 rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create / Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-card w-full max-w-lg p-6 relative z-10 shadow-modal"
            >
              <div className="flex items-center justify-between border-b border-[#1E2A3A] pb-4 mb-4">
                <h2 className="text-lg font-bold text-white">
                  {editingLead ? 'Editar Lead' : 'Nuevo Lead'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-[#4B6A8A] hover:text-white hover:bg-[#1E2A3A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveLead} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      WhatsApp / Teléfono
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Servicio requerido
                    </label>
                    <select
                      value={formData.service}
                      onChange={e => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                    >
                      <option value="Desarrollo Web">Desarrollo Web</option>
                      <option value="App Móvil">App Móvil</option>
                      <option value="Branding">Branding</option>
                      <option value="Diseño UI/UX">Diseño UI/UX</option>
                      <option value="SEO & Marketing">SEO & Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                      className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="contactado">Contactado</option>
                      <option value="propuesta_enviada">Propuesta Enviada</option>
                      <option value="negociacion">Negociación</option>
                      <option value="ganado">Ganado (Convertir)</option>
                      <option value="perdido">Perdido</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Mensaje / Requerimiento
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2A3A]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-[#94A3B8] hover:bg-[#1E2A3A]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#06B6D4] text-white hover:opacity-90 glow-cyan"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
