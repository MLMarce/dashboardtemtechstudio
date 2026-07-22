'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface TopbarProps {
  onMenuClick: () => void
  title?: string
}

export function Topbar({ onMenuClick, title }: TopbarProps) {
  const router = useRouter()
  const supabase = createClient()

  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('Usuario TEMTECH')

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      if (data?.user?.email) {
        setUserEmail(data.user.email)
      }
    }
    loadUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Get avatar initials
  const initials = userEmail
    ? userEmail.substring(0, 2).toUpperCase()
    : 'TT'

  const [showMobileSearch, setShowMobileSearch] = useState(false)

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0F172A]/90 backdrop-blur-md border-b border-[#1E2A3A] flex items-center px-3 sm:px-6 gap-2 sm:gap-4">
      {/* Mobile search bar overlay */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 z-30 bg-[#0F172A] px-3 flex items-center gap-2 md:hidden"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B6A8A]" />
              <input
                type="text"
                autoFocus
                placeholder="Buscar leads, clientes, proyectos..."
                className="w-full bg-[#111827] border border-[#1E2A3A] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-[#4B6A8A] focus:outline-none focus:border-[#06B6D4]"
              />
            </div>
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-2 text-xs font-semibold text-[#06B6D4] hover:text-white"
            >
              Cancelar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A] transition-colors active:scale-95"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title (mobile) */}
      {title && (
        <h1 className="text-white font-semibold text-sm sm:text-base lg:hidden truncate">{title}</h1>
      )}

      {/* Mobile search button */}
      <button
        onClick={() => setShowMobileSearch(true)}
        className="md:hidden p-2.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A] transition-colors active:scale-95"
        aria-label="Buscar"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search bar (desktop) */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B6A8A]" />
          <input
            type="text"
            placeholder="Buscar leads, clientes, proyectos..."
            className="w-full bg-[#111827] border border-[#1E2A3A] rounded-xl pl-9 pr-4 py-2 text-sm text-[#94A3B8] placeholder:text-[#4B6A8A] focus:outline-none focus:border-[#06B6D4]/50 focus:ring-1 focus:ring-[#06B6D4]/20 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1E2A3A] text-[10px] text-[#4B6A8A] font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex-1 lg:flex-none" />

      {/* Right actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
            className="relative p-2.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A] transition-colors active:scale-95"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#06B6D4] pulse-dot" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] max-w-xs sm:w-80 glass-card shadow-modal overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-[#1E2A3A] flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Notificaciones</p>
                  <span className="text-[10px] text-[#06B6D4] font-medium bg-[#06B6D4]/10 px-2 py-0.5 rounded-full">3 nuevas</span>
                </div>
                <div className="divide-y divide-[#1E2A3A] max-h-[60vh] overflow-y-auto">
                  {[
                    { title: 'Nuevo lead recibido', desc: 'Roberto Sánchez — App Móvil', time: 'hace 5m', color: '#06B6D4' },
                    { title: 'Proyecto actualizado', desc: 'Dashboard TechCorp en revisión', time: 'hace 1h', color: '#8B5CF6' },
                    { title: 'Presupuesto aceptado', desc: 'App Móvil Pyme — $120,000', time: 'hace 2h', color: '#22C55E' },
                  ].map((notif, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-[#1E2A3A]/50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ background: notif.color }} />
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-white">{notif.title}</p>
                          <p className="text-xs text-[#94A3B8] mt-0.5">{notif.desc}</p>
                          <p className="text-[10px] text-[#4B6A8A] mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
            className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-xl hover:bg-[#1E2A3A] transition-colors active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {initials}
            </div>
            <div className="hidden sm:block text-left max-w-[120px]">
              <p className="text-xs font-semibold text-white leading-none truncate">
                {userEmail.split('@')[0]}
              </p>
              <p className="text-[10px] text-[#4B6A8A] mt-0.5 truncate">{userEmail}</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#4B6A8A] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 glass-card shadow-modal overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-[#1E2A3A]">
                  <p className="text-sm font-semibold text-white truncate">{userEmail.split('@')[0]}</p>
                  <p className="text-xs text-[#4B6A8A] mt-0.5 truncate">{userEmail}</p>
                  <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30 uppercase tracking-wide">
                    Supabase User
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { router.push('/configuracion'); setProfileOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Configuración
                  </button>
                </div>
                <div className="border-t border-[#1E2A3A] py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(profileOpen || notifOpen || showMobileSearch) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => { setProfileOpen(false); setNotifOpen(false); setShowMobileSearch(false) }}
        />
      )}
    </header>
  )
}
