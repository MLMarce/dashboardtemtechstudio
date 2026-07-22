import { createClient } from '@/lib/supabase/client'
import { Quote } from '@/types'

const supabase = createClient()

export async function getQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from('quotes')
    .select('*, client:clients(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching quotes:', error.message)
    return []
  }
  return data as Quote[]
}

export async function createQuoteRecord(
  quote: Omit<Quote, 'id' | 'created_at' | 'client'>
): Promise<Quote | null> {
  const { data, error } = await supabase
    .from('quotes')
    .insert([quote])
    .select('*, client:clients(*)')
    .single()

  if (error) {
    console.error('Error creating quote:', error.message)
    throw error
  }
  return data as Quote
}

export async function updateQuoteRecord(
  id: string,
  updates: Partial<Quote>
): Promise<Quote | null> {
  const { data, error } = await supabase
    .from('quotes')
    .update(updates)
    .eq('id', id)
    .select('*, client:clients(*)')
    .single()

  if (error) {
    console.error('Error updating quote:', error.message)
    throw error
  }
  return data as Quote
}

export async function deleteQuoteRecord(id: string): Promise<boolean> {
  const { error } = await supabase.from('quotes').delete().eq('id', id)
  if (error) {
    console.error('Error deleting quote:', error.message)
    return false
  }
  return true
}
