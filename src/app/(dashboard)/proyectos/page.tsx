'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderKanban,
  Plus,
  Building,
  Calendar,
  DollarSign,
  GripVertical,
  X,
  CheckCircle2,
} from 'lucide-react'
import { mockProjects, mockClients } from '@/lib/mock-data'
import { Project, ProjectStatus } from '@/types'

const COLUMNS: { id: ProjectStatus; title: string; color: string }[] = [
  { id: 'Pendiente', title: 'Pendiente', color: '#F59E0B' },
  { id: 'En Desarrollo', title: 'En Desarrollo', color: '#06B6D4' },
  { id: 'En Revisión', title: 'En Revisión', color: '#8B5CF6' },
  { id: 'Entregado', title: 'Entregado', color: '#22C55E' },
]

// Project Card item component inside sortable
function ProjectCard({ project, isDragging = false }: { project: Project; isDragging?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const clientName = mockClients.find(c => c.id === project.client_id)?.company || 'Cliente TEMTECH'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-card p-4 space-y-3 cursor-grab active:cursor-grabbing hover:border-[#06B6D4]/40 transition-all ${
        isDragging ? 'opacity-40 scale-105 border-[#06B6D4] shadow-glow-cyan' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-white leading-snug">{project.name}</h4>
        <div {...attributes} {...listeners} className="text-[#4B6A8A] hover:text-[#94A3B8] p-1">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      {project.description && (
        <p className="text-xs text-[#94A3B8] line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center gap-1.5 text-xs text-[#06B6D4] font-medium">
        <Building className="w-3.5 h-3.5" />
        {clientName}
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#4B6A8A] pt-2 border-t border-[#1E2A3A]">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(project.created_at).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'short',
          })}
        </span>
        {project.budget && (
          <span className="font-semibold text-white flex items-center">
            ${project.budget.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    client_id: mockClients[0]?.id || '',
    description: '',
    status: 'Pendiente' as ProjectStatus,
    budget: '',
  })

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const proj = projects.find(p => p.id === event.active.id)
    if (proj) setActiveProject(proj)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveProject(null)

    if (!over) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    // Find target column or target project
    let targetStatus: ProjectStatus | null = null

    if (COLUMNS.some(c => c.id === overId)) {
      targetStatus = overId as ProjectStatus
    } else {
      const overProj = projects.find(p => p.id === overId)
      if (overProj) targetStatus = overProj.status
    }

    if (targetStatus) {
      setProjects(prev =>
        prev.map(p => (p.id === activeId ? { ...p, status: targetStatus! } : p))
      )
      showToast(`Estado de proyecto actualizado a "${targetStatus}"`)
    }
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    const newProj: Project = {
      id: Date.now().toString(),
      client_id: formData.client_id,
      name: formData.name,
      description: formData.description,
      status: formData.status,
      budget: formData.budget ? Number(formData.budget) : null,
      start_date: new Date().toISOString().split('T')[0],
      end_date: null,
      created_at: new Date().toISOString(),
    }
    setProjects([newProj, ...projects])
    setIsModalOpen(false)
    showToast('Proyecto creado exitosamente')
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
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] text-white font-semibold text-sm shadow-modal flex items-center gap-2"
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
            Proyectos (Kanban)
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Arrastra y suelta proyectos entre las distintas columnas del ciclo de vida.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-semibold text-sm hover:opacity-90 transition-all glow-cyan self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => {
            const colProjects = projects.filter(p => p.status === col.id)
            return (
              <div
                key={col.id}
                className="glass-card p-4 flex flex-col h-full min-h-[500px] border border-[#1E2A3A]"
              >
                {/* Column header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E2A3A]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
                    <h3 className="text-sm font-bold text-white">{col.title}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#1E2A3A] text-[#94A3B8]">
                    {colProjects.length}
                  </span>
                </div>

                {/* Column sortable context */}
                <SortableContext
                  id={col.id}
                  items={colProjects.map(p => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex-1 space-y-3 kanban-column">
                    {colProjects.map(proj => (
                      <ProjectCard key={proj.id} project={proj} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            )
          })}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeProject ? <ProjectCard project={activeProject} isDragging /> : null}
        </DragOverlay>
      </DndContext>

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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg p-6 relative z-10 shadow-modal"
            >
              <div className="flex items-center justify-between border-b border-[#1E2A3A] pb-4 mb-4">
                <h2 className="text-lg font-bold text-white">Nuevo Proyecto</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-[#4B6A8A] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Nombre del proyecto
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
                      Estado inicial
                    </label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                      className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Desarrollo">En Desarrollo</option>
                      <option value="En Revisión">En Revisión</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Presupuesto ($)
                    </label>
                    <input
                      type="number"
                      placeholder="150000"
                      value={formData.budget}
                      onChange={e => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Descripción
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06B6D4]"
                  />
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
                    Crear Proyecto
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
