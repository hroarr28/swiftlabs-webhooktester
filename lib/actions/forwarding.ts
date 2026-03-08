'use server';

import { createClient } from '@/lib/supabase/server';

export async function getForwardingRules(endpointId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { rules: [], error: 'Unauthorized' };
  }

  // Verify user owns this endpoint
  const { data: endpoint } = await supabase
    .from('endpoints')
    .select('id')
    .eq('id', endpointId)
    .eq('user_id', user.id)
    .single();

  if (!endpoint) {
    return { rules: [], error: 'Endpoint not found' };
  }

  // Get forwarding rules
  const { data: rules, error } = await supabase
    .from('request_forwards')
    .select('*')
    .eq('endpoint_id', endpointId)
    .order('created_at', { ascending: false });

  if (error) {
    return { rules: [], error: error.message };
  }

  return { rules: rules || [], error: null };
}

export async function getUserSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { subscription: null, error: 'Unauthorized' };
  }

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    return { subscription: null, error: error.message };
  }

  return { subscription, error: null };
}
