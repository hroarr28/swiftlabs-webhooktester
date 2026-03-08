import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { target_url } = body;

  if (!target_url) {
    return NextResponse.json({ error: 'target_url required' }, { status: 400 });
  }

  // Validate URL
  try {
    new URL(target_url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }

  // Send test webhook
  try {
    const testPayload = {
      test: true,
      message: 'This is a test webhook from Webhook Tester',
      timestamp: new Date().toISOString(),
      sent_by: user.email,
    };

    const response = await fetch(target_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WebhookTester/1.0',
        'X-Webhook-Test': 'true',
      },
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        status: response.status,
        message: 'Test webhook sent successfully',
      });
    } else {
      return NextResponse.json({
        success: false,
        status: response.status,
        message: `Target responded with ${response.status}`,
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to send test webhook',
    }, { status: 500 });
  }
}
