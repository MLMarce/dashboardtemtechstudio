'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  /** Max width class for desktop (default: max-w-lg) */
  maxWidth?: string
}

/**
 * Responsive modal:
 *  - Mobile  → slides up from the bottom (bottom sheet) with rounded top corners
 *  - Desktop → centered dialog with scale animation
 */
export function Modal({ isOpen, title, onClose, children, maxWidth = 'max-w-lg' }: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 
            Mobile: slides up from bottom (full-width bottom sheet)
            Desktop (sm+): centered with max width
          */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className={`
              relative z-10 w-full max-w-full bg-[#0D1929] border-t border-[#1E2A3A]
              rounded-t-3xl shadow-2xl flex flex-col
              sm:rounded-2xl sm:border sm:border-[#1E2A3A] sm:${maxWidth} sm:mx-auto
            `}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 320,
            }}
            style={{ maxHeight: '90dvh' }}
          >
            {/* Drag handle (visible on mobile only) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-12 h-1.5 rounded-full bg-[#2D3E50]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-[#1E2A3A] sm:pt-5 sm:px-6 flex-shrink-0">
              <h2 className="text-base font-bold text-white sm:text-lg">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#4B6A8A] hover:text-white hover:bg-[#1E2A3A] transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content (scrollable) */}
            <div className="px-5 py-5 sm:px-6 sm:py-6 overflow-y-auto pb-safe">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
