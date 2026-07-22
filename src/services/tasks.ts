import { createClient } from '@/lib/supabase/client'
import { Task, TaskStatus } from '@/types'

const supabase = createClient()

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, project:projects(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tasks:', error.message)
    return []
  }
  return data as Task[]
}

export async function createTaskRecord(
  task: Omit<Task, 'id' | 'created_at' | 'project'>
): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select('*, project:projects(*)')
    .single()

  if (error) {
    console.error('Error creating task:', error.message)
    throw error
  }
  return data as Task
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus
): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating task status:', error.message)
    return false
  }
  return true
}

export async function updateTaskRecord(
  id: string,
  updates: Partial<Task>
): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select('*, project:projects(*)')
    .single()

  if (error) {
    console.error('Error updating task:', error.message)
    throw error
  }
  return data as Task
}

export async function deleteTaskRecord(id: string): Promise<boolean> {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) {
    console.error('Error deleting task:', error.message)
    return false
  }
  return true
}
