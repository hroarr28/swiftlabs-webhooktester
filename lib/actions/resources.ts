/**
 * Resource CRUD Server Actions
 * 
 * Generic CRUD pattern for any resource type (projects, documents, briefs, etc.)
 * Adapt this for your specific resource by:
 * 1. Replacing 'resources' with your table name
 * 2. Updating the Resource type
 * 3. Adding resource-specific validation
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type Resource = {
  id: string
  user_id: string
  name: string
  description?: string
  status: 'draft' | 'active' | 'archived'
  created_at: string
  updated_at: string
}

export type ResourceInput = {
  name: string
  description?: string
  status?: 'draft' | 'active' | 'archived'
}

/**
 * Create a new resource
 */
export async function createResource(data: ResourceInput) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Create resource
  const { data: resource, error } = await supabase
    .from('resources')
    .insert({
      user_id: user.id,
      name: data.name,
      description: data.description,
      status: data.status || 'draft',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating resource:', error)
    return { error: 'Failed to create resource' }
  }

  revalidatePath('/dashboard')
  return { data: resource }
}

/**
 * Get all resources for current user
 */
export async function getResources() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { data: resources, error } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching resources:', error)
    return { error: 'Failed to fetch resources' }
  }

  return { data: resources }
}

/**
 * Get a single resource by ID
 */
export async function getResource(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { data: resource, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching resource:', error)
    return { error: 'Resource not found' }
  }

  return { data: resource }
}

/**
 * Update a resource
 */
export async function updateResource(id: string, data: Partial<ResourceInput>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { data: resource, error } = await supabase
    .from('resources')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating resource:', error)
    return { error: 'Failed to update resource' }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/resources/${id}`)
  return { data: resource }
}

/**
 * Delete a resource
 */
export async function deleteResource(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting resource:', error)
    return { error: 'Failed to delete resource' }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

/**
 * Duplicate a resource
 */
export async function duplicateResource(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get original resource
  const { data: original, error: fetchError } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !original) {
    return { error: 'Resource not found' }
  }

  // Create duplicate
  const { data: duplicate, error: createError } = await supabase
    .from('resources')
    .insert({
      user_id: user.id,
      name: `${original.name} (Copy)`,
      description: original.description,
      status: 'draft',
    })
    .select()
    .single()

  if (createError) {
    console.error('Error duplicating resource:', createError)
    return { error: 'Failed to duplicate resource' }
  }

  revalidatePath('/dashboard')
  return { data: duplicate }
}
