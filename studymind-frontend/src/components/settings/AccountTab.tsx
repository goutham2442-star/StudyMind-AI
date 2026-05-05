'use client';

import { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Trash2, 
  AlertTriangle,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button, Input, Modal, Card } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function AccountTab({ user }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');
  const [showPass, setShowPass] = useState(false);
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleUpdatePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      return toast.error('New passwords do not match');
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: passwords.new 
      });
      if (error) throw error;
      toast.success('Password updated successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== 'DELETE') return;
    
    setLoading(true);
    try {
      // In a real app, you'd call a backend function to handle cascading deletes and user deletion
      // Supabase Auth deletion is usually done via admin API or RPC
      const { error } = await supabase.rpc('delete_user'); 
      if (error) throw error;
      
      await supabase.auth.signOut();
      router.push('/');
      toast.success('Account deleted. We are sorry to see you go.');
    } catch (error: any) {
      toast.error('You need to contact support to delete your account.');
      setIsDeleteModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Email Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted">Email Address</h3>
        <div className="flex items-center gap-4 p-4 bg-surface-2 border border-border-accent rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-surface-3 flex items-center justify-center text-muted">
            <Mail size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-0.5 text-success">
              <ShieldCheck size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">Verified Account</span>
            </div>
          </div>
          <Badge className="bg-success/10 text-success border-success/20">Primary</Badge>
        </div>
      </section>

      {/* Password Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Lock size={18} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em]">Security</h3>
        </div>

        <div className="space-y-4">
          <Input 
            label="Current Password" 
            type={showPass ? "text" : "password"} 
            placeholder="••••••••" 
            value={passwords.current}
            onChange={(e) => setPasswords({...passwords, current: e.target.value})}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="New Password" 
              type={showPass ? "text" : "password"} 
              placeholder="••••••••" 
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
            />
            <Input 
              label="Confirm New Password" 
              type={showPass ? "text" : "password"} 
              placeholder="••••••••" 
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              suffix={
                <button onClick={() => setShowPass(!showPass)} className="text-muted hover:text-primary transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUpdatePassword} loading={loading} className="px-8">Update Password</Button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4 pt-10">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-error">Danger Zone</h3>
        <Card className="border-error/20 bg-error/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="font-bold text-foreground">Delete Account</p>
              <p className="text-xs text-muted leading-relaxed max-w-sm mt-1">
                Permanently remove your account and all associated data. This action is irreversible.
              </p>
            </div>
          </div>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            Delete Account
          </Button>
        </Card>
      </section>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Are you absolutely sure?"
      >
        <div className="space-y-6">
          <p className="text-sm text-muted leading-relaxed">
            This will permanently delete your profile, all uploaded papers, and chat sessions. This cannot be undone.
          </p>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Type <span className="text-error">DELETE</span> to confirm</label>
            <input
              className="w-full h-11 bg-surface-2 border border-border-accent rounded-xl px-4 text-sm focus:border-error focus:ring-1 focus:ring-error outline-none transition-all"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder="DELETE"
            />
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" className="flex-1" disabled={confirmDelete !== 'DELETE'} onClick={handleDeleteAccount} loading={loading}>
              Delete My Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
