import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error('❌ CRITICAL: Supabase environment variables are missing! Check .env.local');
  }
}

export const supabase = createBrowserClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
