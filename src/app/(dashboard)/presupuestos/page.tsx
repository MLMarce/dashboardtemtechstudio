'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Building,
  Printer,
  Edit2,
  Trash2,
  X,
  Eye,
  Loader2,
} from 'lucide-react'
import {
  getQuotes,
  createQuoteRecord,
  updateQuoteRecord,
  deleteQuoteRecord,
} from '@/services/quotes'
import { getClients } from '@/services/clients'
import { Quote, QuoteStatus, Client } from '@/types'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { Modal } from '@/components/shared/Modal'
import { Toast, ToastState } from '@/components/shared/Toast'

const statusBadges: Record<QuoteStatus, string> = {
  Borrador: 'bg-[#94A3B8]/20 text-[#94A3B8] border-[#94A3B8]/30',
  Enviado: 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/30',
  Aceptado: 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30',
  Rechazado: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30',
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('todos')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [previewQuote, setPreviewQuote] = useState<Quote | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [deletingQuote, setDeletingQuote] = useState<Quote | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const [formData, setFormData] = useState({
    title: '',
    client_id: '',
    amount: '',
    status: 'Borrador' as QuoteStatus,
  })

  const loadData = async () => {
    setLoading(true)
    const [quoteData, clientData] = await Promise.all([getQuotes(), getClients()])
    setQuotes(quoteData)
    setClients(clientData)
    if (clientData.length > 0 && !formData.client_id) {
      setFormData(prev => ({ ...prev, client_id: clientData[0].id }))
    }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const filteredQuotes = quotes.filter(q => {
    const clientName = q.client?.company || q.client?.name || ''
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'todos' || q.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const openCreateModal = () => {
    setEditingQuote(null)
    setFormData({ title: '', client_id: clients[0]?.id || '', amount: '', status: 'Borrador' })
    setIsModalOpen(true)
  }

  const openEditModal = (q: Quote) => {
    setEditingQuote(q)
    setFormData({ title: q.title, client_id: q.client_id, amount: q.amount.toString(), status: q.status })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingQuote) {
        await updateQuoteRecord(editingQuote.id, {
          title: formData.title,
          client_id: formData.client_id,
          amount: Number(formData.amount),
          status: formData.status,
        })
        showToast('Presupuesto actualizado con éxito')
      } else {
        await createQuoteRecord({
          client_id: formData.client_id || (clients[0]?.id ?? ''),
          title: formData.title,
          amount: Number(formData.amount),
          status: formData.status,
        })
        showToast('Presupuesto creado con éxito')
      }
      setIsModalOpen(false)
      await loadData()
    } catch (err: any) {
      showToast('Error en Supabase: ' + err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDeleteQuote = async () => {
    if (!deletingQuote) return
    setDeleteLoading(true)
    try {
      const ok = await deleteQuoteRecord(deletingQuote.id)
      if (ok) {
        setQuotes(quotes.filter(q => q.id !== deletingQuote.id))
        showToast(`Presupuesto "${deletingQuote.title}" eliminado`, 'info')
      } else {
        showToast('No se pudo eliminar el presupuesto', 'error')
      }
    } catch (err: any) {
      showToast('Error al eliminar: ' + err.message, 'error')
    } finally {
      setDeleteLoading(false)
      setDeletingQuote(null)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <ConfirmModal
        isOpen={!!deletingQuote}
        title="¿Eliminar Presupuesto?"
        description={`¿Estás seguro de que deseas eliminar permanentemente la cotización "${deletingQuote?.title}"?`}
        confirmText="Eliminar Presupuesto"
        loading={deleteLoading}
        onConfirm={confirmDeleteQuote}
        onCancel={() => setDeletingQuote(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Gestión de Presupuestos
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Cotizaciones, estados de facturación y vista previa de documentos.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-semibold text-sm hover:opacity-90 transition-all glow-cyan self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Crear Presupuesto
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B6A8A]" />
          <input
            type="text"
            placeholder="Buscar por título o cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#4B6A8A] focus:outline-none focus:border-[#06B6D4]/50"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['todos', 'Borrador', 'Enviado', 'Aceptado', 'Rechazado'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === st ? 'bg-[#06B6D4] text-white shadow-sm' : 'text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A]'
              }`}
            >
              {st === 'todos' ? 'Todos' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-[#94A3B8] flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#F59E0B]" />
              Cargando presupuestos desde Supabase...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E2A3A] text-[11px] font-semibold text-[#4B6A8A] uppercase tracking-wider bg-[#0F172A]/50">
                  <th className="py-3.5 px-4">Presupuesto</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Monto ($)</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4">Fecha</th>
                  <th className="py-3.5 px-4 text-right">Acciones / PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2A3A]/60 text-sm">
                {filteredQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#94A3B8]">
                      No se encontraron presupuestos.
                    </td>
                  </tr>
                ) : (
                  filteredQuotes.map(q => {
                    const clientName = q.client?.company || q.client?.name || 'Cliente'
                    return (
                      <tr key={q.id} className="hover:bg-[#1E2A3A]/40 transition-colors group">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-white group-hover:text-[#06B6D4] transition-colors">
                            {q.title}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                            <Building className="w-3.5 h-3.5 text-[#4B6A8A]" />
                            {clientName}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white font-display">
                          ${q.amount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${statusBadges[q.status]}`}>
                            {q.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#4B6A8A]">
                          {new Date(q.created_at).toLocaleDateString('es-AR', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setPreviewQuote(q)}
                              title="Previsualizar PDF"
                              className="p-1.5 rounded-lg text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(q)}
                              title="Editar"
                              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A]"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingQuote(q)}
                              title="Eliminar"
                              className="p-1.5 rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10"
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

      {/* Modal Create / Edit — responsive: bottom sheet on mobile */}
      <Modal
        isOpen={isModalOpen}
        title={editingQuote ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Título / Propuesta
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#06B6D4] sm:py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Cliente
            </label>
            <select
              value={formData.client_id}
              onChange={e => setFormData({ ...formData, client_id: e.target.value })}
              className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#06B6D4] sm:py-2"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.company} ({c.name})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Monto ($ ARS / USD)
              </label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#06B6D4] sm:py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as QuoteStatus })}
                className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#06B6D4] sm:py-2"
              >
                <option value="Borrador">Borrador</option>
                <option value="Enviado">Enviado</option>
                <option value="Aceptado">Aceptado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-4 border-t border-[#1E2A3A] sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto px-4 py-3 rounded-xl text-sm font-semibold text-[#94A3B8] hover:bg-[#1E2A3A] sm:py-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-4 py-3 rounded-xl text-sm font-semibold bg-[#06B6D4] text-white glow-cyan flex items-center justify-center gap-2 disabled:opacity-50 sm:py-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Guardar
            </button>
          </div>
        </form>
      </Modal>

      {/* PDF Preview — uses AnimatePresence/motion for desktop-centered sheet effect */}
      <AnimatePresence>
        {previewQuote && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setPreviewQuote(null)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative z-10 w-full bg-[#0F172A] border-t border-[#1E2A3A] rounded-t-3xl shadow-2xl sm:rounded-2xl sm:border sm:border-[#1E2A3A] sm:max-w-2xl overflow-auto"
              style={{ maxHeight: '90dvh' }}
            >
              {/* Mobile drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-[#2D3E50]" />
              </div>

              <div className="flex items-center justify-between px-5 pt-4 pb-4 border-b border-[#1E2A3A]">
                <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-wider">
                  TEMTECH — Documento PDF Presupuesto
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-[#06B6D4] text-white text-xs font-semibold flex items-center gap-1.5 hover:opacity-90"
                  >
                    <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
                  </button>
                  <button onClick={() => setPreviewQuote(null)} className="p-1 rounded-lg text-[#4B6A8A] hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-5 sm:p-8">
                <div className="bg-[#111827] p-6 sm:p-8 rounded-xl border border-[#1E2A3A] space-y-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold font-display">
                        TEM<span className="text-[#06B6D4]">TECH</span> Studio
                      </h3>
                      <p className="text-xs text-[#94A3B8]">Agencia de Software & Transformación Digital</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#06B6D4] block">COTIZACIÓN</span>
                      <span className="text-xs text-[#4B6A8A]">#{previewQuote.id.slice(0, 8)}</span>
                    </div>
                  </div>

                  <div className="border-t border-b border-[#1E2A3A] py-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                    <div>
                      <span className="text-[#4B6A8A] block">CLIENTE:</span>
                      <strong className="text-white">
                        {previewQuote.client?.company || previewQuote.client?.name || 'Cliente'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#4B6A8A] block">FECHA DE EMISIÓN:</span>
                      <strong className="text-white">
                        {new Date(previewQuote.created_at).toLocaleDateString('es-AR')}
                      </strong>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">{previewQuote.title}</h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      Incluye desarrollo fullstack, integración de componentes premium, pruebas de calidad y despliegue automatizado en infraestructura cloud.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-4 border-t border-[#1E2A3A] sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-semibold text-white">TOTAL ESTIMADO:</span>
                    <span className="text-2xl font-bold font-display text-[#06B6D4]">
                      ${previewQuote.amount.toLocaleString()} ARS
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
