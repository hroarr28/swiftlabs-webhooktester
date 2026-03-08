import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Webhook receiver endpoint
// Accessible via: /api/w/[slug]
// Captures all HTTP methods and stores request details

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  return handleWebhook(request, 'GET', context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  return handleWebhook(request, 'POST', context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  return handleWebhook(request, 'PUT', context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  return handleWebhook(request, 'PATCH', context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  return handleWebhook(request, 'DELETE', context);
}

async function handleWebhook(
  request: NextRequest,
  method: string,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const supabase = await createClient();

  try {
    // Look up the endpoint by slug
    const { data: endpoint, error: endpointError } = await supabase
      .from('endpoints')
      .select('id, is_active, user_id')
      .eq('slug', slug)
      .single();

    if (endpointError || !endpoint) {
      return NextResponse.json(
        { error: 'Endpoint not found' },
        { status: 404 }
      );
    }

    if (!endpoint.is_active) {
      return NextResponse.json(
        { error: 'Endpoint is inactive' },
        { status: 403 }
      );
    }

    // Extract request details
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Get request body
    const contentType = request.headers.get('content-type') || '';
    let body = '';
    try {
      if (contentType.includes('application/json')) {
        const json = await request.json();
        body = JSON.stringify(json, null, 2);
      } else {
        body = await request.text();
      }
    } catch (e) {
      // Body might be empty or invalid
      body = '';
    }

    // Parse query parameters
    const queryParams: Record<string, string> = {};
    request.nextUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    // Get client IP (from various possible headers)
    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown';

    const userAgent = request.headers.get('user-agent') || '';
    const sizeBytes = Buffer.byteLength(body, 'utf8');

    // Store the request
    const { data: requestRecord, error: insertError } = await supabase
      .from('requests')
      .insert({
        endpoint_id: endpoint.id,
        method,
        path: request.nextUrl.pathname + request.nextUrl.search,
        headers,
        body,
        content_type: contentType,
        query_params: Object.keys(queryParams).length > 0 ? queryParams : null,
        ip_address: ip,
        user_agent: userAgent,
        size_bytes: sizeBytes,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Error storing webhook request:', insertError);
      return NextResponse.json(
        { error: 'Failed to store request' },
        { status: 500 }
      );
    }

    // Check if there are active forwards for this endpoint
    const { data: forwards } = await supabase
      .from('request_forwards')
      .select('id, target_url, filter_method, filter_headers')
      .eq('endpoint_id', endpoint.id)
      .eq('is_active', true);

    // Forward requests if configured
    if (forwards && forwards.length > 0) {
      for (const forward of forwards) {
        // Check method filter
        if (forward.filter_method && forward.filter_method !== method) {
          continue;
        }

        // Check header filters
        if (forward.filter_headers) {
          const matchesHeaders = Object.entries(forward.filter_headers).every(
            ([key, value]) => headers[key] === value
          );
          if (!matchesHeaders) continue;
        }

        // Forward the request (non-blocking)
        forwardRequest(
          forward.target_url,
          method,
          headers,
          body,
          supabase,
          forward.id,
          requestRecord.id
        ).catch(err => {
          console.error('Forward error:', err);
        });
      }
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Webhook received',
        request_id: requestRecord.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Forward request to target URL (fire and forget)
async function forwardRequest(
  targetUrl: string,
  method: string,
  headers: Record<string, string>,
  body: string,
  supabase: any,
  forwardId: string,
  requestId: string
) {
  try {
    // Remove hop-by-hop headers
    const forwardHeaders = { ...headers };
    delete forwardHeaders['host'];
    delete forwardHeaders['connection'];
    delete forwardHeaders['keep-alive'];
    delete forwardHeaders['proxy-authenticate'];
    delete forwardHeaders['proxy-authorization'];
    delete forwardHeaders['te'];
    delete forwardHeaders['trailer'];
    delete forwardHeaders['transfer-encoding'];
    delete forwardHeaders['upgrade'];

    await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body: body || undefined,
    });

    // Update forward stats
    await supabase
      .from('request_forwards')
      .update({
        total_forwards: supabase.raw('total_forwards + 1'),
        last_forwarded_at: new Date().toISOString(),
      })
      .eq('id', forwardId);

    // Mark request as forwarded
    await supabase
      .from('requests')
      .update({
        forwarded: true,
        forwarded_at: new Date().toISOString(),
      })
      .eq('id', requestId);
  } catch (error) {
    console.error('Failed to forward request:', error);
  }
}
