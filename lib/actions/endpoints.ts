'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Endpoint {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  custom_domain: string | null;
}

export interface CreateEndpointInput {
  name: string;
  description?: string;
}

export interface UpdateEndpointInput {
  id: string;
  name?: string;
  description?: string;
  is_active?: boolean;
}

// Generate a unique slug
function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 12; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

// Create a new webhook endpoint
export async function createEndpoint(
  input: CreateEndpointInput
): Promise<{ success: boolean; endpoint?: Endpoint; error?: string }> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Check subscription/limits
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single();

  const plan = subscription?.plan || 'free';

  // Free plan: max 3 endpoints
  if (plan === 'free') {
    const { count } = await supabase
      .from('endpoints')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (count && count >= 3) {
      return {
        success: false,
        error: 'Free plan limited to 3 endpoints. Upgrade to Pro for unlimited.',
      };
    }
  }

  // Generate unique slug
  let slug = generateSlug();
  let attempts = 0;
  while (attempts < 10) {
    const { data: existing } = await supabase
      .from('endpoints')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!existing) break;
    slug = generateSlug();
    attempts++;
  }

  if (attempts >= 10) {
    return { success: false, error: 'Failed to generate unique slug' };
  }

  // Create endpoint
  const { data: endpoint, error: createError } = await supabase
    .from('endpoints')
    .insert({
      user_id: user.id,
      slug,
      name: input.name,
      description: input.description || null,
    })
    .select()
    .single();

  if (createError || !endpoint) {
    return { success: false, error: 'Failed to create endpoint' };
  }

  revalidatePath('/dashboard');
  return { success: true, endpoint };
}

// Get all user endpoints
export async function getEndpoints(): Promise<{
  success: boolean;
  endpoints?: Endpoint[];
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data: endpoints, error: fetchError } = await supabase
    .from('endpoints')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (fetchError) {
    return { success: false, error: 'Failed to fetch endpoints' };
  }

  return { success: true, endpoints: endpoints || [] };
}

// Get single endpoint
export async function getEndpoint(
  id: string
): Promise<{ success: boolean; endpoint?: Endpoint; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data: endpoint, error: fetchError } = await supabase
    .from('endpoints')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !endpoint) {
    return { success: false, error: 'Endpoint not found' };
  }

  return { success: true, endpoint };
}

// Update endpoint
export async function updateEndpoint(
  input: UpdateEndpointInput
): Promise<{ success: boolean; endpoint?: Endpoint; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  const updateData: any = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.is_active !== undefined) updateData.is_active = input.is_active;

  const { data: endpoint, error: updateError } = await supabase
    .from('endpoints')
    .update(updateData)
    .eq('id', input.id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (updateError || !endpoint) {
    return { success: false, error: 'Failed to update endpoint' };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/endpoints/${input.id}`);
  return { success: true, endpoint };
}

// Delete endpoint
export async function deleteEndpoint(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error: deleteError } = await supabase
    .from('endpoints')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (deleteError) {
    return { success: false, error: 'Failed to delete endpoint' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}
