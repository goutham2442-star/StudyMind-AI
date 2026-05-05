import { createServerClient as createServerClient_base } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createServerClient = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('❌ CRITICAL: Supabase environment variables are missing! Check .env.local');
  }

  const cookieStore = await cookies();
  return createServerClient_base(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
        }
      },
    },
  });
};

export const createAPIClient = createServerClient;
