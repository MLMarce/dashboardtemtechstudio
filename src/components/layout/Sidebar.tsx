'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FolderKanban,
  CheckSquare,
  FileText,
  FolderOpen,
  Settings,
  Zap,
  X,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard',      label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/leads',          label: 'Leads',         icon: Users },
  { href: '/clientes',       label: 'Clientes',      icon: UserCheck },
  { href: '/proyectos',      label: 'Proyectos',     icon: FolderKanban },
  { href: '/tareas',         label: 'Tareas',        icon: CheckSquare },
  { href: '/presupuestos',   label: 'Presupuestos',  icon: FileText },
  { href: '/archivos',       label: 'Archivos',      icon: FolderOpen },
]

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

function SidebarContent({ onMobileClose }: { onMobileClose?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E2A3A]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] flex items-center justify-center glow-cyan transition-all duration-300 group-hover:scale-105">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-700 text-lg text-white tracking-tight">
            TEM<span className="gradient-text-cyan">TECH</span>
          </span>
        </Link>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-[#4B6A8A] hover:text-white hover:bg-[#1E2A3A] transition-colors lg:hidden"
            aria-label="Cerrar sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item, i) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
            >
              <Link
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  'sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium group relative',
                  isActive
                    ? 'bg-gradient-to-r from-[#06B6D4]/15 to-[#8B5CF6]/10 text-white border border-[#06B6D4]/20'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E2A3A]'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#06B6D4] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    'w-4.5 h-4.5 flex-shrink-0 transition-colors',
                    isActive ? 'text-[#06B6D4]' : 'text-[#4B6A8A] group-hover:text-[#94A3B8]'
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#06B6D4] opacity-70" />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Bottom — Settings */}
      <div className="px-3 pb-4 border-t border-[#1E2A3A] pt-3">
        <Link
          href="/configuracion"
          onClick={onMobileClose}
          className={cn(
            'sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
            pathname === '/configuracion'
              ? 'bg-[#1E2A3A] text-white'
              : 'text-[#4B6A8A] hover:text-white hover:bg-[#1E2A3A]'
          )}
        >
          <Settings className="w-4.5 h-4.5" />
          <span>Configuración</span>
        </Link>

        {/* Version badge */}
        <div className="mt-3 px-3 py-2 rounded-xl bg-gradient-to-r from-[#06B6D4]/10 to-[#8B5CF6]/10 border border-[#1E2A3A]">
          <p className="text-[10px] text-[#4B6A8A] uppercase tracking-widest font-medium">TEMTECH Studio</p>
          <p className="text-xs text-[#94A3B8] font-medium mt-0.5">Dashboard v1.0</p>
        </div>
      </div>
    </div>
  )
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-30 bg-[#0F172A] border-r border-[#1E2A3A]">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed left-0 top-0 z-50 h-screen w-72 bg-[#0F172A] border-r border-[#1E2A3A] lg:hidden"
            >
              <SidebarContent onMobileClose={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
