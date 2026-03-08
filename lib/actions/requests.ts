'use server';

import { createClient } from '@/lib/supabase/server';

export interface WebhookRequest {
  id: string;
  endpoint_id: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  body: string | null;
  content_type: string | null;
  query_params: Record<string, string> | null;
  ip_address: string | null;
  user_agent: string | null;
  size_bytes: number;
  forwarded: boolean;
  forwarded_at: string | null;
  created_at: string;
}

export interface RequestFilters {
  endpointId: string;
  method?: string;
  limit?: number;
  offset?: number;
}

// Get requests for an endpoint
export async function getRequests(
  filters: RequestFilters
): Promise<{
  success: boolean;
  requests?: WebhookRequest[];
  total?: number;
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

  // Verify endpoint ownership
  const { data: endpoint } = await supabase
    .from('endpoints')
    .select('id')
    .eq('id', filters.endpointId)
    .eq('user_id', user.id)
    .single();

  if (!endpoint) {
    return { success: false, error: 'Endpoint not found' };
  }

  // Build query
  let query = supabase
    .from('requests')
    .select('*', { count: 'exact' })
    .eq('endpoint_id', filters.endpointId)
    .order('created_at', { ascending: false });

  if (filters.method) {
    query = query.eq('method', filters.method);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
  }

  const { data: requests, error: fetchError, count } = await query;

  if (fetchError) {
    return { success: false, error: 'Failed to fetch requests' };
  }

  return {
    success: true,
    requests: requests || [],
    total: count || 0,
  };
}

// Get single request
export async function getRequest(
  id: string
): Promise<{ success: boolean; request?: WebhookRequest; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data: request, error: fetchError } = await supabase
    .from('requests')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !request) {
    return { success: false, error: 'Request not found' };
  }

  // Verify endpoint ownership
  const { data: endpoint } = await supabase
    .from('endpoints')
    .select('id')
    .eq('id', request.endpoint_id)
    .eq('user_id', user.id)
    .single();

  if (!endpoint) {
    return { success: false, error: 'Unauthorized' };
  }

  return { success: true, request };
}

// Delete all requests for an endpoint
export async function deleteRequests(
  endpointId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Verify endpoint ownership
  const { data: endpoint } = await supabase
    .from('endpoints')
    .select('id')
    .eq('id', endpointId)
    .eq('user_id', user.id)
    .single();

  if (!endpoint) {
    return { success: false, error: 'Endpoint not found' };
  }

  const { error: deleteError } = await supabase
    .from('requests')
    .delete()
    .eq('endpoint_id', endpointId);

  if (deleteError) {
    return { success: false, error: 'Failed to delete requests' };
  }

  return { success: true };
}

// Delete single request
export async function deleteRequest(
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

  // Get request to verify ownership
  const { data: request } = await supabase
    .from('requests')
    .select('endpoint_id')
    .eq('id', id)
    .single();

  if (!request) {
    return { success: false, error: 'Request not found' };
  }

  // Verify endpoint ownership
  const { data: endpoint } = await supabase
    .from('endpoints')
    .select('id')
    .eq('id', request.endpoint_id)
    .eq('user_id', user.id)
    .single();

  if (!endpoint) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error: deleteError } = await supabase
    .from('requests')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return { success: false, error: 'Failed to delete request' };
  }

  return { success: true };
}

// Get request statistics for an endpoint
export async function getRequestStats(
  endpointId: string
): Promise<{
  success: boolean;
  stats?: {
    total: number;
    methods: Record<string, number>;
    recentCount24h: number;
    avgSizeBytes: number;
  };
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

  // Verify endpoint ownership
  const { data: endpoint } = await supabase
    .from('endpoints')
    .select('id')
    .eq('id', endpointId)
    .eq('user_id', user.id)
    .single();

  if (!endpoint) {
    return { success: false, error: 'Endpoint not found' };
  }

  // Get all requests for stats
  const { data: requests } = await supabase
    .from('requests')
    .select('method, created_at, size_bytes')
    .eq('endpoint_id', endpointId);

  if (!requests) {
    return {
      success: true,
      stats: {
        total: 0,
        methods: {},
        recentCount24h: 0,
        avgSizeBytes: 0,
      },
    };
  }

  // Calculate stats
  const methods: Record<string, number> = {};
  let totalSize = 0;
  let recentCount = 0;
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  for (const req of requests) {
    // Count by method
    methods[req.method] = (methods[req.method] || 0) + 1;

    // Sum size
    totalSize += req.size_bytes;

    // Count recent
    if (new Date(req.created_at).getTime() > oneDayAgo) {
      recentCount++;
    }
  }

  return {
    success: true,
    stats: {
      total: requests.length,
      methods,
      recentCount24h: recentCount,
      avgSizeBytes: requests.length > 0 ? Math.round(totalSize / requests.length) : 0,
    },
  };
}
