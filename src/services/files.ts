import { createClient } from '@/lib/supabase/client'
import { FileRecord } from '@/types'

const supabase = createClient()

export async function getFiles(): Promise<FileRecord[]> {
  const { data, error } = await supabase
    .from('files')
    .select('*, project:projects(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching files:', error.message)
    return []
  }
  return data as FileRecord[]
}

export async function uploadFileToStorage(
  file: File,
  projectId?: string
): Promise<FileRecord | null> {
  const filePath = `${Date.now()}-${file.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('files')
    .upload(filePath, file)

  let fileUrl = '#'
  if (!uploadError && uploadData) {
    const { data: publicUrlData } = supabase.storage
      .from('files')
      .getPublicUrl(uploadData.path)
    fileUrl = publicUrlData.publicUrl
  }

  const { data: dbData, error: dbError } = await supabase
    .from('files')
    .insert([
      {
        project_id: projectId || null,
        file_name: file.name,
        file_url: fileUrl,
      },
    ])
    .select('*, project:projects(*)')
    .single()

  if (dbError) {
    console.error('Error inserting file record:', dbError.message)
    throw dbError
  }

  return dbData as FileRecord
}

export async function deleteFileRecord(id: string, fileName?: string): Promise<boolean> {
  if (fileName) {
    await supabase.storage.from('files').remove([fileName])
  }
  const { error } = await supabase.from('files').delete().eq('id', id)
  if (error) {
    console.error('Error deleting file record:', error.message)
    return false
  }
  return true
}
