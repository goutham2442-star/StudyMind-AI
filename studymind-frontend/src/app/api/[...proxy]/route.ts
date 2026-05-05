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

    // Try to parse as JSON, but handle non-JSON error pages
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      console.error('Non-JSON Proxy Response:', text);
      return NextResponse.json({ 
        error: 'Backend returned non-JSON response', 
        status: response.status,
        details: text.slice(0, 200) 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Proxy Connection Error:', {
      url,
      method: req.method,
      error: error.message
    });
    return NextResponse.json({ 
      error: 'Backend connection failed', 
      details: error.message,
      hint: 'Ensure the backend is running at ' + BACKEND_URL 
    }, { status: 500 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
