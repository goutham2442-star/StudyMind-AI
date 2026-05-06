import { NextRequest, NextResponse } from 'next/server';
import { createAPIClient } from '@/lib/supabase/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function proxyRequest(req: NextRequest, { params }: { params: Promise<{ proxy: string[] }> }) {
  const supabase = await createAPIClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const { proxy } = await params;
  const path = proxy.join('/');
  const searchParams = req.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/api/${path}${searchParams ? `?${searchParams}` : ''}`;

  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('connection');
  
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' ? await req.blob() : undefined,
      cache: 'no-store'
    });

    // Check if it's a streaming response
    const contentType = response.headers.get('content-type');
    const isStream = contentType?.includes('text/event-stream');

    if (isStream && response.body) {
      // Pass-through the stream
      return new NextResponse(response.body, {
        status: response.status,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      return new NextResponse(text, { 
        status: response.status,
        headers: { 'Content-Type': contentType || 'text/plain' }
      });
    }
  } catch (error: any) {
    console.error('Proxy Connection Error:', { url, error: error.message });
    return NextResponse.json({ 
      error: 'Backend connection failed', 
      details: error.message 
    }, { status: 500 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
