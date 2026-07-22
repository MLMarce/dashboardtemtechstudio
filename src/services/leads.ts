import { createClient } from '@/lib/supabase/client'
import { Lead, LeadStatus } from '@/types'

const supabase = createClient()

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leads:', error.message)
    return []
  }
  return data as Lead[]
}

export async function createLead(lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single()

  if (error) {
    console.error('Error creating lead:', error.message)
    throw error
  }
  return data as Lead
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating lead:', error.message)
    throw error
  }
  return data as Lead
}

export async function deleteLead(id: string): Promise<boolean> {
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) {
    console.error('Error deleting lead:', error.message)
    return false
  }
  return true
}

export async function convertLeadToClient(lead: Lead): Promise<boolean> {
  // 1. Create client record
  const { error: clientError } = await supabase.from('clients').insert([
    {
      name: lead.name,
      company: `${lead.name} Corp`,
      email: lead.email,
      phone: lead.phone,
      notes: `Convertido automáticamente desde Lead (${lead.service})`,
    },
  ])

  if (clientError) {
    console.error('Error creating client from lead:', clientError.message)
    throw clientError
  }

  // 2. Update lead status to 'ganado'
  const { error: leadError } = await supabase
    .from('leads')
    .update({ status: 'ganado' })
    .eq('id', lead.id)

  if (leadError) {
    console.error('Error updating lead status:', leadError.message)
    throw leadError
  }

  return true
}
