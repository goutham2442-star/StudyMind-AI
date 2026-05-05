'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, School, Book, GraduationCap, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button, Input } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    university: '',
    department: '',
    yearOfStudy: '1',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (!formData.agreedToTerms) {
      return toast.error('Please agree to the Terms of Service');
    }

    setLoading(true);

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (authError) throw authError;

      // 2. Profile insertion is handled by database trigger (001_schema.sql)
      // But we can update additional fields if needed
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            university: formData.university,
            department: formData.department,
            year_of_study: parseInt(formData.yearOfStudy),
          })
          .eq('id', authData.user.id);
        
        if (profileError) {
          console.error('Profile update error:', profileError);
          // Don't throw, auth succeeded anyway
        }
      }

      toast.success('Check your email to verify your account!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-h-[90vh] overflow-y-auto pr-2 custom-scrollbar"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-extrabold tracking-tight">Create your account 🎓</h1>
        <p className="text-muted text-sm font-medium">Start studying smarter today</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          icon={User}
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />

        <Input
          label="Email Address"
          placeholder="name@university.edu"
          type="email"
          icon={Mail}
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          label="University"
          placeholder="e.g. Oxford University"
          icon={School}
          required
          value={formData.university}
          onChange={(e) => setFormData({ ...formData, university: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Department"
            placeholder="e.g. CS"
            icon={Book}
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Year</label>
            <select
              className="w-full h-10 bg-surface border border-border-accent rounded-xl px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              value={formData.yearOfStudy}
              onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
            >
              {[1, 2, 3, 4, 5, 6].map(year => (
                <option key={year} value={year}>{year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Password"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Input
            label="Confirm"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        <label className="flex items-start gap-3 group cursor-pointer">
          <input 
            type="checkbox" 
            className="mt-1 w-4 h-4 rounded border-border-accent text-primary focus:ring-primary bg-surface"
            checked={formData.agreedToTerms}
            onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
          />
          <span className="text-xs text-muted leading-relaxed group-hover:text-foreground/80 transition-colors">
            I agree to the <Link href="/terms" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>
          </span>
        </label>

        <Button 
          type="submit" 
          className="w-full h-12 text-base group" 
          loading={loading}
        >
          Create Account <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-accent"></div>
        </div>
        <span className="relative px-4 bg-background text-[10px] font-bold text-muted uppercase tracking-widest">
          or continue with
        </span>
      </div>

      <button
        type="button"
        className="w-full h-12 flex items-center justify-center gap-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all shadow-sm"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
