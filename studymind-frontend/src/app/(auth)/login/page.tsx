'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button, Input } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast.success('Welcome back!');
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-10"
    >
      <div className="space-y-3">
        <h1 className="text-4xl font-heading font-black tracking-tighter text-glow">Welcome back</h1>
        <p className="text-muted text-sm font-black uppercase tracking-widest opacity-50">Sign in to your academic portal</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <Input
          label="Institutional Email"
          placeholder="name@university.edu"
          type="email"
          icon={Mail}
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-white/5 border-white/10 focus:border-primary transition-all rounded-2xl"
        />

        <div className="relative group">
          <Input
            label="Security Password"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="bg-white/5 border-white/10 focus:border-primary transition-all rounded-2xl"
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted hover:text-primary transition-all p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          <div className="flex justify-end mt-2">
            <Link 
              href="/forgot-password" 
              className="text-[10px] font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-[0.2em]"
            >
              Recover Access
            </Link>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-14 text-sm font-black uppercase tracking-widest group rounded-2xl shadow-[0_15px_30px_rgba(79,142,247,0.2)]" 
          loading={loading}
        >
          Authorize Session <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <span className="relative px-6 bg-[#08080C] text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-40">
          Federated Access
        </span>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full h-14 flex items-center justify-center gap-4 bg-white text-black font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-white/90 transition-all shadow-xl group"
      >
        <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-muted opacity-60">
        New to the platform?{' '}
        <Link href="/register" className="text-primary hover:text-primary/80 transition-colors">
          Create Account
        </Link>
      </p>
    </motion.div>
  );
}
