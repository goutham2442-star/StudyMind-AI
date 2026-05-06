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

  const handleDemoLogin = () => {
    setFormData({
      email: 'student@studymind.ai',
      password: 'password123',
    });
    toast.success('Demo credentials loaded!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-10"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <h1 className="text-4xl font-heading font-black tracking-tighter text-glow">Welcome back</h1>
          <p className="text-muted text-sm font-black uppercase tracking-widest opacity-50">Sign in to your academic portal</p>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleDemoLogin}
          className="h-10 px-4 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] bg-primary/5 text-primary border-primary/10 hover:bg-primary hover:text-white"
        >
          Quick Demo Access
        </Button>
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
          className="bg-white/5 border-white/10 focus:border-primary transition-all rounded-2xl h-12"
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
            className="bg-white/5 border-white/10 focus:border-primary transition-all rounded-2xl h-12"
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
          className="w-full h-14 text-sm font-black uppercase tracking-widest group rounded-2xl shadow-glow-lg" 
          loading={loading}
        >
          Authorize Session <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
      </div>

      <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-muted opacity-60">
        New to the platform?{' '}
        <Link href="/register" className="text-primary hover:text-primary/80 transition-colors">
          Create Account
        </Link>
      </p>
    </motion.div>
  );
}
