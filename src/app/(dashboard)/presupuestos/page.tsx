'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Plus,
  Search,
  Building,
  DollarSign,
  Download,
  Printer,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Eye,
} from 'lucide-react'
import { mockQuotes, mockClients } from '@/lib/mock-data'
import { Quote, QuoteStatus } from '@/types'

const statusBadges: Record<QuoteStatus, string> = {
  Borrador: 'bg-[#94A3B8]/20 text-[#94A3B8] border-[#94A3B8]/30',
  Enviado: 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/30',
  Aceptado: 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30',
  Rechazado: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30',
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('todos')

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [previewQuote, setPreviewQuote] = useState<Quote | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    client_id: mockClients[0]?.id || '',
    amount: '',
    status: 'Borrador' as QuoteStatus,
  })

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const filteredQuotes = quotes.filter(q => {
    const client = mockClients.find(c => c.id === q.client_id)
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      client?.company.toLowerCase().includes(search.toLowerCase()) ||
      client?.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'todos' || q.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const openCreateModal = () => {
    setEditingQuote(null)
    setFormData({
      title: '',
      client_id: mockClients[0]?.id || '',
      amount: '',
      status: 'Borrador',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (q: Quote) => {
    setEditingQuote(q)
    setFormData({
      title: q.title,
      client_id: q.client_id,
      amount: q.amount.toString(),
      status: q.status,
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingQuote) {
      setQuotes(
        quotes.map(q =>
          q.id === editingQuote.id
            ? { ...q, ...formData, amount: Number(formData.amount) }
            : q
        )
      )
      showToast('Presupuesto actualizado')
    } else {
      const newQuote: Quote = {
        id: Date.now().toString(),
        client_id: formData.client_id,
        title: formData.title,
        amount: Number(formData.amount),
        status: formData.status,
        created_at: new Date().toISOString(),
      }
      setQuotes([newQuote, ...quotes])
      showToast('Presupuesto creado')
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setQuotes(quotes.filter(q => q.id !== id))
    showToast('Presupuesto eliminado')
  }

  // PDF Export simulator / printer architecture
  const handlePrintPDF = (quote: Quote) => {
    setPreviewQuote(quote)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#06B6D4] text-white font-semibold text-sm shadow-modal flex items-center gap-2"
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
            Gestión de Presupuestos
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Cotizaciones, estados de facturación y previsualización de documentos PDF.
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
                filterStatus === st
                  ? 'bg-[#06B6D4] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A]'
              }`}
            >
              {st === 'todos' ? 'Todos' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
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
                  const client = mockClients.find(c => c.id === q.client_id)
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
                          {client?.company || 'Cliente'}
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
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handlePrintPDF(q)}
                            title="Previsualizar PDF / Imprimir"
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
                            onClick={() => handleDelete(q.id)}
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg p-6 relative z-10 shadow-modal"
            >
              <div className="flex items-center justify-between border-b border-[#1E2A3A] pb-4 mb-4">
                <h2 className="text-lg font-bold text-white">
                  {editingQuote ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-[#4B6A8A] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Título / Propuesta
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Cliente
                  </label>
                  <select
                    value={formData.client_id}
                    onChange={e => setFormData({ ...formData, client_id: e.target.value })}
                    className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                  >
                    {mockClients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.company} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Monto ($ ARS / USD)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as QuoteStatus })}
                      className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                    >
                      <option value="Borrador">Borrador</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Aceptado">Aceptado</option>
                      <option value="Rechazado">Rechazado</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2A3A]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-[#94A3B8]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#06B6D4] text-white glow-cyan"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF Document Preview Modal */}
      <AnimatePresence>
        {previewQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setPreviewQuote(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0F172A] border border-[#1E2A3A] w-full max-w-2xl rounded-2xl p-8 relative z-10 shadow-modal overflow-hidden text-white"
            >
              {/* Top bar controls */}
              <div className="flex items-center justify-between border-b border-[#1E2A3A] pb-4 mb-6">
                <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-wider">
                  TEMTECH Studio — Documento PDF Presupuesto
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-[#06B6D4] text-white text-xs font-semibold flex items-center gap-1.5 hover:opacity-90"
                  >
                    <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
                  </button>
                  <button
                    onClick={() => setPreviewQuote(null)}
                    className="p-1 rounded-lg text-[#4B6A8A] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PDF Document Card preview */}
              <div className="bg-[#111827] p-8 rounded-xl border border-[#1E2A3A] space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-display text-white">
                      TEM<span className="text-[#06B6D4]">TECH</span> Studio
                    </h3>
                    <p className="text-xs text-[#94A3B8]">Agencia de Software & Transformación Digital</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#06B6D4] block">COTIZACIÓN</span>
                    <span className="text-xs text-[#4B6A8A]">#{previewQuote.id}</span>
                  </div>
                </div>

                <div className="border-t border-b border-[#1E2A3A] py-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#4B6A8A] block">CLIENTE:</span>
                    <strong className="text-white">
                      {mockClients.find(c => c.id === previewQuote.client_id)?.company}
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

                <div className="flex items-center justify-between pt-4 border-t border-[#1E2A3A]">
                  <span className="text-sm font-semibold text-white">TOTAL ESTIMADO:</span>
                  <span className="text-2xl font-bold font-display text-[#06B6D4]">
                    ${previewQuote.amount.toLocaleString()} ARS
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
