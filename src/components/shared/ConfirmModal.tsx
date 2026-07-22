'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="glass-card w-full max-w-md p-6 relative z-10 shadow-modal border border-[#1E2A3A]"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl flex-shrink-0 ${
                  danger
                    ? 'bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444]'
                    : 'bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B]'
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white leading-snug">{title}</h3>
                <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">{description}</p>
              </div>
              <button
                onClick={onCancel}
                className="p-1 rounded-lg text-[#4B6A8A] hover:text-white hover:bg-[#1E2A3A] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-[#1E2A3A]">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A] transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-2 disabled:opacity-50 ${
                  danger
                    ? 'bg-[#EF4444] hover:bg-[#EF4444]/90 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                    : 'bg-[#F59E0B] hover:bg-[#F59E0B]/90'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
