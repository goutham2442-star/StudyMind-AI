import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const isHtml = request.headers.get('accept')?.includes('text/html');
    
    if (isHtml) {
      return new NextResponse(
        `
        <html>
          <head>
            <title>Configuration Error | StudyMind AI</title>
            <style>
              body { font-family: sans-serif; background: #08080C; color: #F1F5F9; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { background: #111118; padding: 40px; border-radius: 24px; border: 1px solid #1E1E2E; max-width: 500px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
              h1 { color: #4F8EF7; margin-top: 0; }
              code { background: #1E1E2E; padding: 4px 8px; border-radius: 4px; color: #E2E8F0; }
              p { line-height: 1.6; opacity: 0.8; }
              .btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #4F8EF7; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>⚠️ Configuration Required</h1>
              <p>Your Supabase URL and Anon Key are missing from <code>.env.local</code>.</p>
              <p>Please create <code>studymind-frontend/.env.local</code> and add your <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</p>
              <a href="https://supabase.com/dashboard" target="_blank" class="btn">Go to Supabase Dashboard</a>
            </div>
          </body>
        </html>
        `,
        { status: 500, headers: { 'Content-Type': 'text/html' } }
      );
    }

    return new NextResponse(
      JSON.stringify({ 
        error: 'Configuration Error', 
        message: 'Supabase URL or Anon Key is missing. Please check your .env.local file.' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Route protection
  const { pathname } = request.nextUrl;
  const isAppRoute = pathname.startsWith('/dashboard') || 
                     pathname.startsWith('/library') || 
                     pathname.startsWith('/upload') || 
                     pathname.startsWith('/settings') || 
                     pathname.startsWith('/chat');

  const isAuthRoute = pathname.startsWith('/login') || 
                      pathname.startsWith('/register');

  if (isAppRoute && !session) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && session) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export default proxy;

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/library/:path*', 
    '/upload/:path*', 
    '/settings/:path*', 
    '/chat/:path*', 
    '/login', 
    '/register'
  ],
};
