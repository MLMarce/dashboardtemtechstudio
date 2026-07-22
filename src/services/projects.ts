import { createClient } from '@/lib/supabase/client'
import { Project, ProjectStatus } from '@/types'

const supabase = createClient()

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, client:clients(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error.message)
    return []
  }
  return data as Project[]
}

export async function createProjectRecord(
  project: Omit<Project, 'id' | 'created_at' | 'client'>
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select('*, client:clients(*)')
    .single()

  if (error) {
    console.error('Error creating project:', error.message)
    throw error
  }
  return data as Project
}

export async function updateProjectStatus(
  id: string,
  status: ProjectStatus
): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating project status:', error.message)
    return false
  }
  return true
}

export async function updateProjectRecord(
  id: string,
  updates: Partial<Project>
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select('*, client:clients(*)')
    .single()

  if (error) {
    console.error('Error updating project:', error.message)
    throw error
  }
  return data as Project
}

export async function deleteProjectRecord(id: string): Promise<boolean> {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) {
    console.error('Error deleting project:', error.message)
    return false
  }
  return true
}
