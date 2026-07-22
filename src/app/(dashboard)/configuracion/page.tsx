'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Save,
  CheckCircle2,
  Key,
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'supabase'>('profile')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast */}
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
      <div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">
          Configuración del Sistema
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Ajustes de perfil, preferencias de notificación y conexión con Supabase.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E2A3A] pb-3 overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        {[
          { id: 'profile', label: 'Perfil', icon: User },
          { id: 'notifications', label: 'Notificaciones', icon: Bell },
          { id: 'supabase', label: 'Conexión Supabase', icon: Database },
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-[#06B6D4]/15 to-[#8B5CF6]/10 text-white border border-[#06B6D4]/30 shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#06B6D4]' : ''}`} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-xl glow-cyan">
              AD
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Admin TEMTECH</h3>
              <p className="text-xs text-[#94A3B8]">admin@temtech.studio</p>
              <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30 uppercase">
                Rol: Administrator
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#1E2A3A]">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                defaultValue="Admin TEMTECH"
                className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Email Corporativo
              </label>
              <input
                type="email"
                defaultValue="admin@temtech.studio"
                className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#1E2A3A]">
            <button
              onClick={() => showToast('Cambios de perfil guardados')}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#06B6D4] text-white glow-cyan flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Guardar Cambios
            </button>
          </div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-4"
        >
          {[
            { label: 'Notificar nuevos leads por Email', desc: 'Recibir una alerta cada vez que ingrese un nuevo lead' },
            { label: 'Alertas de cambio de estado en Proyectos', desc: 'Notificar cuando un proyecto pase a revisión o entregado' },
            { label: 'Alertas de tareas bloqueadas', desc: 'Recibir notificación cuando una tarea cambie a Bloqueada' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#0F172A]/80 border border-[#1E2A3A]">
              <div>
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-[#94A3B8]">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-[#06B6D4] cursor-pointer"
              />
            </div>
          ))}

          <div className="flex justify-end pt-4 border-t border-[#1E2A3A]">
            <button
              onClick={() => showToast('Preferencias guardadas')}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#06B6D4] text-white glow-cyan flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Guardar Preferencias
            </button>
          </div>
        </motion.div>
      )}

      {/* Supabase Tab */}
      {activeTab === 'supabase' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Estado de la Arquitectura Backend</h3>
              <p className="text-xs text-[#22C55E] font-semibold">✓ Arquitectura lista para producción</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E2A3A] space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-[#06B6D4]" /> Instrucciones de conexión
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Crea un archivo <code className="text-[#06B6D4] font-mono">.env.local</code> en la raíz del proyecto agregando tus credenciales de Supabase:
            </p>
            <pre className="p-3 rounded-lg bg-[#080B14] text-xs font-mono text-[#06B6D4] overflow-x-auto border border-[#1E2A3A]">
              NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co{'\n'}
              NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-aqui
            </pre>
            <p className="text-xs text-[#94A3B8]">
              Ejecuta el script SQL ubicado en <code className="text-[#8B5CF6] font-mono">supabase/migrations/001_initial_schema.sql</code> en el SQL Editor de tu Dashboard de Supabase.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
