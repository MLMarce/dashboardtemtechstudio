'use client'

import { useEffect } from 'react'
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
  // Lock scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCancel])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end sm:items-center sm:justify-center sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Bottom sheet on mobile, centered card on sm+ */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-full bg-[#0D1929] border-t border-[#1E2A3A] rounded-t-3xl shadow-2xl overflow-hidden sm:rounded-2xl sm:border sm:border-[#1E2A3A] sm:max-w-md sm:mx-auto"
          >
            {/* Drag handle (mobile only) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-12 h-1.5 rounded-full bg-[#2D3E50]" />
            </div>

            <div className="px-5 pt-4 pb-6 sm:px-6 sm:pt-6 pb-safe">
              {/* Close button */}
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-2 rounded-xl text-[#4B6A8A] hover:text-white hover:bg-[#1E2A3A] transition-colors sm:top-5 sm:right-5"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon + Title + Description */}
              <div className="flex items-start gap-4 pr-8">
                <div
                  className={`p-3 rounded-2xl flex-shrink-0 ${
                    danger
                      ? 'bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444]'
                      : 'bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B]'
                  }`}
                >
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white leading-snug sm:text-lg">{title}</h3>
                  <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">{description}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-2.5 pt-6 mt-4 border-t border-[#1E2A3A] sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-xl text-sm font-semibold text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A] transition-colors disabled:opacity-50 sm:py-2.5"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className={`w-full sm:w-auto px-4 py-3.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 sm:py-2.5 ${
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
