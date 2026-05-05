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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 max-h-[90vh] overflow-y-auto pr-4 custom-scrollbar"
    >
      <div className="space-y-3">
        <h1 className="text-4xl font-heading font-black tracking-tighter text-glow">Create Account</h1>
        <p className="text-muted text-sm font-black uppercase tracking-widest opacity-50">Initialize your academic profile</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        <Input
          label="Full Legal Name"
          placeholder="John Doe"
          icon={User}
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="bg-white/5 border-white/10 focus:border-primary transition-all rounded-2xl"
        />

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

        <Input
          label="University / Institution"
          placeholder="e.g. Oxford University"
          icon={School}
          required
          value={formData.university}
          onChange={(e) => setFormData({ ...formData, university: e.target.value })}
          className="bg-white/5 border-white/10 focus:border-primary transition-all rounded-2xl"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Department"
            placeholder="e.g. CS"
            icon={Book}
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="bg-white/5 border-white/10 focus:border-primary transition-all rounded-2xl"
          />
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Academic Year</label>
            <select
              className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-xs font-bold uppercase tracking-widest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
              value={formData.yearOfStudy}
              onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
            >
              {[1, 2, 3, 4, 5, 6].map(year => (
                <option key={year} value={year} className="bg-[#0A0A0F]">
                  {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Access Password"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="bg-white/5 border-white/10 focus:border-primary transition-all rounded-2xl"
          />
          <Input
            label="Confirm Password"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
        </div>

        <label className="flex items-start gap-4 group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
          <div className="relative flex items-center h-5">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded-lg border-white/10 text-primary focus:ring-primary bg-white/5 transition-all"
              checked={formData.agreedToTerms}
              onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
            />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted leading-tight group-hover:text-foreground/80 transition-colors">
            I acknowledge the <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">Privacy Protocol</Link>
          </span>
        </label>

        <Button 
          type="submit" 
          className="w-full h-14 text-sm font-black uppercase tracking-widest group rounded-2xl shadow-[0_15px_30px_rgba(79,142,247,0.2)]" 
          loading={loading}
        >
          Initialize Account <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
      </div>

      <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-muted opacity-60">
        Already registered?{' '}
        <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}
