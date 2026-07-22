'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus,
  Building,
  Calendar,
  GripVertical,
  Trash2,
  Loader2,
} from 'lucide-react'
import {
  getProjects,
  createProjectRecord,
  updateProjectStatus,
  deleteProjectRecord,
} from '@/services/projects'
import { getClients } from '@/services/clients'
import { Project, ProjectStatus, Client } from '@/types'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { Modal } from '@/components/shared/Modal'
import { Toast, ToastState } from '@/components/shared/Toast'

const COLUMNS: { id: ProjectStatus; title: string; color: string }[] = [
  { id: 'Pendiente', title: 'Pendiente', color: '#F59E0B' },
  { id: 'En Desarrollo', title: 'En Desarrollo', color: '#06B6D4' },
  { id: 'En Revisión', title: 'En Revisión', color: '#8B5CF6' },
  { id: 'Entregado', title: 'Entregado', color: '#22C55E' },
]

function ProjectCard({
  project,
  isDragging = false,
  onDelete,
}: {
  project: Project
  isDragging?: boolean
  onDelete?: (project: Project) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const clientName = project.client?.company || 'Cliente'

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
        <div className="flex items-center gap-1">
          {onDelete && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onDelete(project) }}
              className="text-[#4B6A8A] hover:text-[#EF4444] p-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <div {...attributes} {...listeners} className="text-[#4B6A8A] hover:text-[#94A3B8] p-1">
            <GripVertical className="w-4 h-4" />
          </div>
        </div>
      </div>
      {project.description && <p className="text-xs text-[#94A3B8] line-clamp-2">{project.description}</p>}
      <div className="flex items-center gap-1.5 text-xs text-[#06B6D4] font-medium">
        <Building className="w-3.5 h-3.5" />
        {clientName}
      </div>
      <div className="flex items-center justify-between text-[11px] text-[#4B6A8A] pt-2 border-t border-[#1E2A3A]">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(project.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
        </span>
        {project.budget && (
          <span className="font-semibold text-white">${project.budget.toLocaleString()}</span>
        )}
      </div>
    </div>
  )
}

function KanbanColumn({
  column,
  projects,
  onDeleteProject,
}: {
  column: { id: ProjectStatus; title: string; color: string }
  projects: Project[]
  onDeleteProject: (p: Project) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      className={`glass-card p-4 flex flex-col h-full min-h-[500px] border transition-all ${
        isOver ? 'border-[#06B6D4] bg-[#06B6D4]/5' : 'border-[#1E2A3A]'
      }`}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E2A3A]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: column.color }} />
          <h3 className="text-sm font-bold text-white">{column.title}</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#1E2A3A] text-[#94A3B8]">
          {projects.length}
        </span>
      </div>
      <SortableContext id={column.id} items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-3 kanban-column">
          {projects.length === 0 ? (
            <div className="h-32 border border-dashed border-[#1E2A3A] rounded-xl flex items-center justify-center text-xs text-[#4B6A8A]">
              Arrastra un proyecto aquí
            </div>
          ) : (
            projects.map(proj => (
              <ProjectCard key={proj.id} project={proj} onDelete={onDeleteProject} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    description: '',
    status: 'Pendiente' as ProjectStatus,
    budget: '',
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const loadData = async () => {
    setLoading(true)
    const [projData, clientData] = await Promise.all([getProjects(), getClients()])
    setProjects(projData)
    setClients(clientData)
    if (clientData.length > 0 && !formData.client_id) {
      setFormData(prev => ({ ...prev, client_id: clientData[0].id }))
    }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const proj = projects.find(p => p.id === event.active.id)
    if (proj) setActiveProject(proj)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveProject(null)
    if (!over) return
    const activeId = active.id.toString()
    const overId = over.id.toString()
    let targetStatus: ProjectStatus | null = null
    if (COLUMNS.some(c => c.id === overId)) {
      targetStatus = overId as ProjectStatus
    } else {
      const overProj = projects.find(p => p.id === overId)
      if (overProj) targetStatus = overProj.status
    }
    if (targetStatus) {
      setProjects(prev => prev.map(p => (p.id === activeId ? { ...p, status: targetStatus! } : p)))
      await updateProjectStatus(activeId, targetStatus)
      showToast(`Estado actualizado a "${targetStatus}"`, 'info')
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createProjectRecord({
        client_id: formData.client_id || (clients[0]?.id ?? null),
        name: formData.name,
        description: formData.description,
        status: formData.status,
        budget: formData.budget ? Number(formData.budget) : null,
        start_date: new Date().toISOString().split('T')[0],
        end_date: null,
      })
      setIsModalOpen(false)
      showToast('Proyecto creado con éxito')
      await loadData()
    } catch (err: any) {
      showToast('Error en Supabase: ' + err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDeleteProject = async () => {
    if (!deletingProject) return
    setDeleteLoading(true)
    try {
      const ok = await deleteProjectRecord(deletingProject.id)
      if (ok) {
        setProjects(projects.filter(p => p.id !== deletingProject.id))
        showToast(`Proyecto "${deletingProject.name}" eliminado`, 'info')
      } else {
        showToast('No se pudo eliminar el proyecto', 'error')
      }
    } catch (err: any) {
      showToast('Error al eliminar: ' + err.message, 'error')
    } finally {
      setDeleteLoading(false)
      setDeletingProject(null)
    }
  }

  const customCollisionDetection = (args: any) => {
    const pointerCollisions = pointerWithin(args)
    if (pointerCollisions.length > 0) return pointerCollisions
    return rectIntersection(args)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <ConfirmModal
        isOpen={!!deletingProject}
        title="¿Eliminar Proyecto?"
        description={`¿Estás seguro de que deseas eliminar permanentemente el proyecto "${deletingProject?.name}"? Esta acción removerá el proyecto y sus tareas asociadas.`}
        confirmText="Eliminar Proyecto"
        loading={deleteLoading}
        onConfirm={confirmDeleteProject}
        onCancel={() => setDeletingProject(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Proyectos (Kanban + Supabase)
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Arrastra proyectos entre estados con actualización automática en la base de datos.
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

      {loading ? (
        <div className="p-12 text-center text-[#94A3B8] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#06B6D4]" />
          Cargando proyectos desde Supabase...
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
            {COLUMNS.map(col => {
              const colProjects = projects.filter(p => p.status === col.id)
              return (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  projects={colProjects}
                  onDeleteProject={p => setDeletingProject(p)}
                />
              )
            })}
          </div>
          <DragOverlay>
            {activeProject ? <ProjectCard project={activeProject} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Modal — responsive: bottom sheet on mobile, centered on desktop */}
      <Modal
        isOpen={isModalOpen}
        title="Nuevo Proyecto"
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Nombre del proyecto
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                Estado inicial
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#06B6D4] sm:py-2"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Desarrollo">En Desarrollo</option>
                <option value="En Revisión">En Revisión</option>
                <option value="Entregado">Entregado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Presupuesto ($)
              </label>
              <input
                type="number"
                placeholder="150000"
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#06B6D4] sm:py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Descripción
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#06B6D4] sm:py-2"
            />
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
              Crear Proyecto
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
