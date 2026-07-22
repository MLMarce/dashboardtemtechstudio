'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Archive,
  Download,
  Trash2,
  Search,
  File,
  Loader2,
} from 'lucide-react'
import {
  getFiles,
  uploadFileToStorage,
  deleteFileRecord,
} from '@/services/files'
import { FileRecord } from '@/types'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { Toast, ToastState } from '@/components/shared/Toast'

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')

  // Modal Delete
  const [deletingFile, setDeletingFile] = useState<FileRecord | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Drag & drop upload state
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  
  // Toast
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadData = async () => {
    setLoading(true)
    const fileData = await getFiles()
    setFiles(fileData)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredFiles = files.filter(f =>
    f.file_name.toLowerCase().includes(search.toLowerCase())
  )

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-400" />
      case 'docx':
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-400" />
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <ImageIcon className="w-5 h-5 text-emerald-400" />
      case 'zip':
      case 'rar':
        return <Archive className="w-5 h-5 text-amber-400" />
      default:
        return <File className="w-5 h-5 text-cyan-400" />
    }
  }

  const handleUploadFiles = async (fileList: FileList | File[]) => {
    setUploading(true)
    try {
      for (const file of Array.from(fileList)) {
        await uploadFileToStorage(file)
      }
      showToast(`Archivos subidos a Supabase Storage con éxito`)
      await loadData()
    } catch (err: any) {
      showToast('Error subiendo archivo: ' + err.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  const confirmDeleteFile = async () => {
    if (!deletingFile) return
    setDeleteLoading(true)
    try {
      const ok = await deleteFileRecord(deletingFile.id, deletingFile.file_name)
      if (ok) {
        setFiles(files.filter(f => f.id !== deletingFile.id))
        showToast(`Archivo "${deletingFile.file_name}" eliminado`, 'info')
      } else {
        showToast('No se pudo eliminar el archivo', 'error')
      }
    } catch (err: any) {
      showToast('Error al eliminar: ' + err.message, 'error')
    } finally {
      setDeleteLoading(false)
      setDeletingFile(null)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingFile}
        title="¿Eliminar Archivo?"
        description={`¿Estás seguro de que deseas eliminar permanentemente "${deletingFile?.file_name}" de Supabase Storage?`}
        confirmText="Eliminar Archivo"
        loading={deleteLoading}
        onConfirm={confirmDeleteFile}
        onCancel={() => setDeletingFile(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Centro de Archivos (Supabase Storage)
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Conectado al Bucket de Supabase Storage (<code className="text-[#06B6D4]">files</code>).
          </p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={e => {
          e.preventDefault()
          setIsDraggingOver(true)
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={e => {
          e.preventDefault()
          setIsDraggingOver(false)
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUploadFiles(e.dataTransfer.files)
          }
        }}
        className={`glass-card p-8 text-center border-2 border-dashed transition-all cursor-pointer ${
          isDraggingOver
            ? 'border-[#06B6D4] bg-[#06B6D4]/10 shadow-glow-cyan'
            : 'border-[#1E2A3A] hover:border-[#06B6D4]/40'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#06B6D4]/20 to-[#8B5CF6]/20 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4]">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-[#06B6D4]" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {uploading ? 'Subiendo archivos a Supabase...' : 'Arrastra archivos aquí o selecciona desde tu equipo'}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">
              Soporta PDF, DOCX, PNG, JPG y ZIP almacenados en Supabase Bucket
            </p>
          </div>
          <label className="cursor-pointer">
            <span className="px-4 py-2 rounded-xl bg-[#1E2A3A] hover:bg-[#06B6D4]/20 text-xs font-semibold text-[#06B6D4] transition-colors inline-block">
              Examinar archivos
            </span>
            <input
              type="file"
              className="hidden"
              multiple
              disabled={uploading}
              onChange={e => {
                if (e.target.files && e.target.files.length > 0) {
                  handleUploadFiles(e.target.files)
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B6A8A]" />
          <input
            type="text"
            placeholder="Buscar archivo por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#1E2A3A] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#4B6A8A] focus:outline-none focus:border-[#06B6D4]/50"
          />
        </div>
      </div>

      {/* Files Grid / List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-[#94A3B8] flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#06B6D4]" />
              Cargando archivos desde Supabase...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E2A3A] text-[11px] font-semibold text-[#4B6A8A] uppercase tracking-wider bg-[#0F172A]/50">
                  <th className="py-3.5 px-4">Nombre del Archivo</th>
                  <th className="py-3.5 px-4">Proyecto Asociado</th>
                  <th className="py-3.5 px-4">Fecha de Subida</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2A3A]/60 text-sm">
                {filteredFiles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[#94A3B8]">
                      No hay archivos subidos en Supabase.
                    </td>
                  </tr>
                ) : (
                  filteredFiles.map(file => {
                    const projName = file.project?.name || 'General'
                    return (
                      <tr key={file.id} className="hover:bg-[#1E2A3A]/40 transition-colors group">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#0F172A] border border-[#1E2A3A]">
                              {getFileIcon(file.file_name)}
                            </div>
                            <span className="font-semibold text-white group-hover:text-[#06B6D4] transition-colors">
                              {file.file_name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#94A3B8]">
                          <span className="px-2.5 py-1 rounded-lg bg-[#1E2A3A] text-white font-medium">
                            {projName}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#4B6A8A]">
                          {new Date(file.created_at).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {file.file_url !== '#' && (
                              <a
                                href={file.file_url}
                                target="_blank"
                                rel="noreferrer"
                                download
                                title="Descargar"
                                className="p-1.5 rounded-lg text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => setDeletingFile(file)}
                              title="Eliminar"
                              className="p-1.5 rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
