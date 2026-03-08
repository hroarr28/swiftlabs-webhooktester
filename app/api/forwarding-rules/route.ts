import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const endpointId = request.nextUrl.searchParams.get('endpoint_id');
  if (!endpointId) {
    return NextResponse.json({ error: 'endpoint_id required' }, { status: 400 });
  }

  // Verify user owns this endpoint
  const { data: endpoint } = await supabase
    .from('endpoints')
    .select('id')
    .eq('id', endpointId)
    .eq('user_id', user.id)
    .single();

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
  }

  // Get forwarding rules
  const { data: rules, error } = await supabase
    .from('request_forwards')
    .select('*')
    .eq('endpoint_id', endpointId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rules });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { endpoint_id, target_url, filter_method } = body;

  if (!endpoint_id || !target_url) {
    return NextResponse.json(
      { error: 'endpoint_id and target_url are required' },
      { status: 400 }
    );
  }

  // Validate URL
  try {
    new URL(target_url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }

  // Verify user owns this endpoint
  const { data: endpoint } = await supabase
    .from('endpoints')
    .select('id')
    .eq('id', endpoint_id)
    .eq('user_id', user.id)
    .single();

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
  }

  // Check subscription plan (Pro feature)
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single();

  if (subscription?.plan !== 'pro') {
    return NextResponse.json(
      { error: 'Forwarding rules require Pro plan' },
      { status: 403 }
    );
  }

  // Create forwarding rule
  const { data: rule, error } = await supabase
    .from('request_forwards')
    .insert({
      endpoint_id,
      target_url,
      filter_method: filter_method || null,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rule });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, is_active } = body;

  if (!id || is_active === undefined) {
    return NextResponse.json(
      { error: 'id and is_active are required' },
      { status: 400 }
    );
  }

  // Verify user owns this rule (via endpoint ownership)
  const { data: rule } = await supabase
    .from('request_forwards')
    .select('endpoint_id, endpoints!inner(user_id)')
    .eq('id', id)
    .single();

  if (!rule || (rule.endpoints as any).user_id !== user.id) {
    return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
  }

  // Update rule
  const { error } = await supabase
    .from('request_forwards')
    .update({ is_active })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  // Verify user owns this rule (via endpoint ownership)
  const { data: rule } = await supabase
    .from('request_forwards')
    .select('endpoint_id, endpoints!inner(user_id)')
    .eq('id', id)
    .single();

  if (!rule || (rule.endpoints as any).user_id !== user.id) {
    return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
  }

  // Delete rule
  const { error } = await supabase
    .from('request_forwards')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
