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
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  GripVertical,
  Trash2,
  X,
  Loader2,
} from 'lucide-react'
import {
  getTasks,
  createTaskRecord,
  updateTaskStatus,
  deleteTaskRecord,
} from '@/services/tasks'
import { getProjects } from '@/services/projects'
import { Task, TaskStatus, TaskPriority, Project } from '@/types'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { Toast, ToastState } from '@/components/shared/Toast'

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'Pendiente', title: 'Pendiente', color: '#F59E0B' },
  { id: 'En progreso', title: 'En progreso', color: '#06B6D4' },
  { id: 'Bloqueada', title: 'Bloqueada', color: '#EF4444' },
  { id: 'Completada', title: 'Completada', color: '#22C55E' },
]

const priorityBadges: Record<TaskPriority, string> = {
  baja: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  media: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  alta: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  urgente: 'bg-red-500/20 text-red-400 border-red-500/30',
}

function TaskCard({
  task,
  isDragging = false,
  onDelete,
}: {
  task: Task
  isDragging?: boolean
  onDelete?: (task: Task) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const projName = task.project?.name || 'General'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-card p-4 space-y-3 cursor-grab active:cursor-grabbing hover:border-[#8B5CF6]/40 transition-all ${
        isDragging ? 'opacity-40 scale-105 border-[#8B5CF6] shadow-glow-violet' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-white leading-snug">{task.title}</h4>
        <div className="flex items-center gap-1">
          {onDelete && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                onDelete(task)
              }}
              className="text-[#4B6A8A] hover:text-[#EF4444] p-1 transition-colors"
              title="Eliminar tarea"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <div {...attributes} {...listeners} className="text-[#4B6A8A] hover:text-[#94A3B8] p-1">
            <GripVertical className="w-4 h-4" />
          </div>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-[#94A3B8] line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-[#1E2A3A]">
        <span className="text-[11px] text-[#4B6A8A] truncate max-w-[140px]">
          {projName}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${priorityBadges[task.priority]}`}>
          {task.priority}
        </span>
      </div>
    </div>
  )
}

function KanbanColumn({
  column,
  tasks,
  onDeleteTask,
}: {
  column: { id: TaskStatus; title: string; color: string }
  tasks: Task[]
  onDeleteTask: (t: Task) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      className={`glass-card p-4 flex flex-col h-full min-h-[500px] border transition-all ${
        isOver ? 'border-[#8B5CF6] bg-[#8B5CF6]/5' : 'border-[#1E2A3A]'
      }`}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E2A3A]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: column.color }} />
          <h3 className="text-sm font-bold text-white">{column.title}</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#1E2A3A] text-[#94A3B8]">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        id={column.id}
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-3 kanban-column">
          {tasks.length === 0 ? (
            <div className="h-32 border border-dashed border-[#1E2A3A] rounded-xl flex items-center justify-center text-xs text-[#4B6A8A]">
              Arrastra una tarea aquí
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  // Modal Create
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Modal Delete
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    status: 'Pendiente' as TaskStatus,
    priority: 'media' as TaskPriority,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const loadData = async () => {
    setLoading(true)
    const [taskData, projData] = await Promise.all([
      getTasks(),
      getProjects(),
    ])
    setTasks(taskData)
    setProjects(projData)
    if (projData.length > 0 && !formData.project_id) {
      setFormData(prev => ({ ...prev, project_id: projData[0].id }))
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const t = tasks.find(x => x.id === event.active.id)
    if (t) setActiveTask(t)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    let targetStatus: TaskStatus | null = null

    // Check if dropped directly on a column
    if (COLUMNS.some(c => c.id === overId)) {
      targetStatus = overId as TaskStatus
    } else {
      // Check if dropped on a task inside a column
      const overTask = tasks.find(t => t.id === overId)
      if (overTask) targetStatus = overTask.status
    }

    if (targetStatus) {
      setTasks(prev =>
        prev.map(t => (t.id === activeId ? { ...t, status: targetStatus! } : t))
      )
      await updateTaskStatus(activeId, targetStatus)
      showToast(`Estado de tarea actualizado a "${targetStatus}"`, 'info')
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createTaskRecord({
        project_id: formData.project_id || (projects[0]?.id ?? null),
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assigned_to: null,
      })
      setIsModalOpen(false)
      showToast('Tarea creada con éxito')
      await loadData()
    } catch (err: any) {
      showToast('Error en Supabase: ' + err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDeleteTask = async () => {
    if (!deletingTask) return
    setDeleteLoading(true)
    try {
      const ok = await deleteTaskRecord(deletingTask.id)
      if (ok) {
        setTasks(tasks.filter(t => t.id !== deletingTask.id))
        showToast(`Tarea "${deletingTask.title}" eliminada`, 'info')
      } else {
        showToast('No se pudo eliminar la tarea', 'error')
      }
    } catch (err: any) {
      showToast('Error al eliminar: ' + err.message, 'error')
    } finally {
      setDeleteLoading(false)
      setDeletingTask(null)
    }
  }

  // Custom collision detection: try pointer first, fall back to rect intersection
  const customCollisionDetection = (args: any) => {
    const pointerCollisions = pointerWithin(args)
    if (pointerCollisions.length > 0) return pointerCollisions
    return rectIntersection(args)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingTask}
        title="¿Eliminar Tarea?"
        description={`¿Estás seguro de que deseas eliminar permanentemente la tarea "${deletingTask?.title}"?`}
        confirmText="Eliminar Tarea"
        loading={deleteLoading}
        onConfirm={confirmDeleteTask}
        onCancel={() => setDeletingTask(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Gestión de Tareas (Kanban + Supabase)
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Arrastra tareas para actualizar su progreso en tiempo real.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white font-semibold text-sm hover:opacity-90 transition-all glow-violet self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nueva Tarea
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#94A3B8] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#8B5CF6]" />
          Cargando tareas desde Supabase...
        </div>
      ) : (
        /* Kanban Board */
        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
            {COLUMNS.map(col => {
              const colTasks = tasks.filter(t => t.status === col.id)
              return (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  tasks={colTasks}
                  onDeleteTask={t => setDeletingTask(t)}
                />
              )
            })}
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      )}

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
                <h2 className="text-lg font-bold text-white">Nueva Tarea</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-[#4B6A8A] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Título de la tarea
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Proyecto asociado
                  </label>
                  <select
                    value={formData.project_id}
                    onChange={e => setFormData({ ...formData, project_id: e.target.value })}
                    className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                      className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En progreso">En progreso</option>
                      <option value="Bloqueada">Bloqueada</option>
                      <option value="Completada">Completada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                      Prioridad
                    </label>
                    <select
                      value={formData.priority}
                      onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                      className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
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
                    className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
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
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#8B5CF6] text-white glow-violet flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Crear Tarea
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
