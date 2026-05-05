import { NextRequest, NextResponse } from 'next/server';
import { createAPIClient } from '@/lib/supabase/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function proxyRequest(req: NextRequest, { params }: { params: { proxy: string[] } }) {
  const supabase = await createAPIClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const path = params.proxy.join('/');
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

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: 'Proxy request failed', details: error.message }, { status: 500 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
