import { createClient } from '@/lib/supabase/client'
import { Client } from '@/types'

const supabase = createClient()

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching clients:', error.message)
    return []
  }
  return data as Client[]
}

export async function createClientRecord(
  client: Omit<Client, 'id' | 'created_at'>
): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single()

  if (error) {
    console.error('Error creating client:', error.message)
    throw error
  }
  return data as Client
}

export async function updateClientRecord(
  id: string,
  updates: Partial<Client>
): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating client:', error.message)
    throw error
  }
  return data as Client
}

export async function deleteClientRecord(id: string): Promise<boolean> {
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) {
    console.error('Error deleting client:', error.message)
    return false
  }
  return true
}
