'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Building,
  Mail,
  Phone,
  FolderKanban,
  Edit2,
  Trash2,
  X,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import {
  getClients,
  createClientRecord,
  updateClientRecord,
  deleteClientRecord,
} from '@/services/clients'
import { getProjects } from '@/services/projects'
import { Client, Project } from '@/types'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { Toast, ToastState } from '@/components/shared/Toast'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modal Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Modal Delete
  const [deletingClient, setDeletingClient] = useState<Client | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    notes: '',
  })

  const loadData = async () => {
    setLoading(true)
    const [clientData, projectData] = await Promise.all([
      getClients(),
      getProjects(),
    ])
    setClients(clientData)
    setProjects(projectData)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredClients = clients.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  const openCreateModal = () => {
    setEditingClient(null)
    setFormData({ name: '', company: '', email: '', phone: '', notes: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (c: Client) => {
    setEditingClient(c)
    setFormData({
      name: c.name,
      company: c.company,
      email: c.email,
      phone: c.phone,
      notes: c.notes || '',
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingClient) {
        await updateClientRecord(editingClient.id, formData)
        showToast('Cliente actualizado con éxito')
      } else {
        await createClientRecord(formData)
        showToast('Cliente creado con éxito')
      }
      setIsModalOpen(false)
      await loadData()
    } catch (err: any) {
      showToast('Error en Supabase: ' + err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDeleteClient = async () => {
    if (!deletingClient) return
    setDeleteLoading(true)
    try {
      const ok = await deleteClientRecord(deletingClient.id)
      if (ok) {
        setClients(clients.filter(c => c.id !== deletingClient.id))
        showToast(`Cliente "${deletingClient.company}" eliminado`, 'info')
      } else {
        showToast('No se pudo eliminar el cliente', 'error')
      }
    } catch (err: any) {
      showToast('Error al eliminar: ' + err.message, 'error')
    } finally {
      setDeleteLoading(false)
      setDeletingClient(null)
    }
  }

  const getClientProjectCount = (clientId: string) => {
    return projects.filter(p => p.client_id === clientId).length
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deletingClient}
        title="¿Eliminar Cliente?"
        description={`¿Estás seguro de que deseas eliminar a "${deletingClient?.company}" (${deletingClient?.name})? Los proyectos asociados podrían quedar desvinculados.`}
        confirmText="Eliminar Cliente"
        loading={deleteLoading}
        onConfirm={confirmDeleteClient}
        onCancel={() => setDeletingClient(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Gestión de Clientes
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Directorio de empresas y clientes activos de TEMTECH Studio.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-semibold text-sm hover:opacity-90 transition-all glow-cyan self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Crear Cliente
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B6A8A]" />
          <input
            type="text"
            placeholder="Buscar cliente por nombre, empresa o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#4B6A8A] focus:outline-none focus:border-[#06B6D4]/50"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-[#94A3B8] flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#06B6D4]" />
              Cargando clientes desde Supabase...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E2A3A] text-[11px] font-semibold text-[#4B6A8A] uppercase tracking-wider bg-[#0F172A]/50">
                  <th className="py-3.5 px-4">Cliente / Contacto</th>
                  <th className="py-3.5 px-4">Empresa</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Teléfono</th>
                  <th className="py-3.5 px-4">Proyectos</th>
                  <th className="py-3.5 px-4">Fecha Alta</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2A3A]/60 text-sm">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#94A3B8]">
                      No hay clientes registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map(client => {
                    const projCount = getClientProjectCount(client.id)
                    return (
                      <tr key={client.id} className="hover:bg-[#1E2A3A]/40 transition-colors group">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#06B6D4]/20 to-[#8B5CF6]/20 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] font-bold text-sm">
                              {client.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-white group-hover:text-[#06B6D4] transition-colors">
                                {client.name}
                              </p>
                              {client.notes && (
                                <p className="text-xs text-[#94A3B8] line-clamp-1">
                                  {client.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-xs text-white">
                            <Building className="w-3.5 h-3.5 text-[#4B6A8A]" />
                            {client.company}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#94A3B8]">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#4B6A8A]" />
                            {client.email}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#94A3B8]">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#4B6A8A]" />
                            {client.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/proyectos`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1E2A3A] hover:bg-[#06B6D4]/20 hover:text-[#06B6D4] text-xs font-semibold text-[#94A3B8] transition-colors"
                          >
                            <FolderKanban className="w-3.5 h-3.5" />
                            {projCount} {projCount === 1 ? 'proyecto' : 'proyectos'}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#4B6A8A]">
                          {new Date(client.created_at).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(client)}
                              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A]"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingClient(client)}
                              className="p-1.5 rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
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
                  {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-[#4B6A8A] hover:text-white hover:bg-[#1E2A3A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Nombre del contacto
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Empresa / Razón Social
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
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
                      Teléfono
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

                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Notas adicionales
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
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
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#06B6D4] text-white hover:opacity-90 glow-cyan flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
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
