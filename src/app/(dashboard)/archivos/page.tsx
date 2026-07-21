'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderOpen,
  UploadCloud,
  FileText,
  FileCode,
  Image as ImageIcon,
  Archive,
  Download,
  Trash2,
  Search,
  CheckCircle2,
  X,
  File,
} from 'lucide-react'
import { mockFiles, mockProjects } from '@/lib/mock-data'
import { FileRecord } from '@/types'

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>(mockFiles)
  const [search, setSearch] = useState('')

  // Drag & drop upload state
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

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

  const handleFileUploadSimulated = (fileName: string) => {
    const newFile: FileRecord = {
      id: Date.now().toString(),
      project_id: mockProjects[0]?.id || null,
      file_name: fileName,
      file_url: '#',
      uploaded_by: null,
      created_at: new Date().toISOString(),
    }
    setFiles([newFile, ...files])
    showToast(`Archivo "${fileName}" subido a Supabase Storage`)
  }

  const handleDelete = (id: string) => {
    setFiles(files.filter(f => f.id !== id))
    showToast('Archivo eliminado')
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
            Centro de Archivos
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Gestión centralizada conectada con Supabase Storage (PDF, DOCX, PNG, JPG, ZIP).
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
            Array.from(e.dataTransfer.files).forEach(f =>
              handleFileUploadSimulated(f.name)
            )
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
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Arrastra archivos aquí o selecciona desde tu equipo
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">
              Soporta PDF, DOCX, PNG, JPG y ZIP hasta 50MB
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
              onChange={e => {
                if (e.target.files) {
                  Array.from(e.target.files).forEach(f =>
                    handleFileUploadSimulated(f.name)
                  )
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
                    No hay archivos subidos.
                  </td>
                </tr>
              ) : (
                filteredFiles.map(file => {
                  const proj = mockProjects.find(p => p.id === file.project_id)
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
                          {proj?.name || 'General'}
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
                          <a
                            href={file.file_url}
                            download
                            title="Descargar"
                            className="p-1.5 rounded-lg text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(file.id)}
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
        </div>
      </div>
    </div>
  )
}
