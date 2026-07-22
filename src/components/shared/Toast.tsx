'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface ToastState {
  message: string
  type?: 'success' | 'error' | 'info'
}

interface ToastProps {
  toast: ToastState | null
  onClose: () => void
}

export function Toast({ toast, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl text-white font-semibold text-sm shadow-modal flex items-center gap-3 border ${
            toast.type === 'error'
              ? 'bg-gradient-to-r from-[#EF4444] to-[#991B1B] border-[#EF4444]/40'
              : toast.type === 'info'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] border-[#8B5CF6]/40'
              : 'bg-gradient-to-r from-[#06B6D4] to-[#22C55E] border-[#06B6D4]/40'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
