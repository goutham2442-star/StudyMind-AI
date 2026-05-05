'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, User, School, Book, Calendar, Info } from 'lucide-react';
import { Button, Input, Avatar } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { trimAndLimit } from '@/lib/sanitizer';

export function ProfileTab({ user, profile, onUpdate }: any) {
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    university: profile?.university || '',
    department: profile?.department || '',
    yearOfStudy: profile?.year_of_study?.toString() || '1',
    bio: profile?.bio || '',
    avatarUrl: profile?.avatar_url || '',
  });

  useEffect(() => {
    const isDifferent = 
      formData.fullName !== (profile?.full_name || '') ||
      formData.university !== (profile?.university || '') ||
      formData.department !== (profile?.department || '') ||
      formData.yearOfStudy !== (profile?.year_of_study?.toString() || '1') ||
      formData.bio !== (profile?.bio || '') ||
      formData.avatarUrl !== (profile?.avatar_url || '');
    setHasChanges(isDifferent);
  }, [formData, profile]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));
      toast.success('Avatar uploaded! Save to apply changes.');
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setLoading(true);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: trimAndLimit(formData.fullName, 100),
          university: trimAndLimit(formData.university, 100),
          department: trimAndLimit(formData.department, 100),
          year_of_study: parseInt(formData.yearOfStudy),
          bio: trimAndLimit(formData.bio, 160),
          avatar_url: formData.avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      onUpdate();
      setHasChanges(false);
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <div 
          className="relative group cursor-pointer"
          onClick={handleAvatarClick}
        >
          <Avatar 
            name={formData.fullName} 
            src={formData.avatarUrl} 
            size="xl" 
            className="w-32 h-32 border-4 border-primary/20"
          />
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
            <Camera className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Change Photo</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleAvatarUpload}
          />
        </div>
        <p className="text-xs text-muted font-medium uppercase tracking-widest">Click to upload new avatar</p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          placeholder="Enter your name"
          icon={User}
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
        <Input
          label="University"
          placeholder="e.g. Oxford University"
          icon={School}
          value={formData.university}
          onChange={(e) => setFormData({ ...formData, university: e.target.value })}
        />
        <Input
          label="Department"
          placeholder="e.g. Computer Science"
          icon={Book}
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        />
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" /> Year of Study
          </label>
          <select
            className="w-full h-11 bg-surface-2 border border-border-accent rounded-xl px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            value={formData.yearOfStudy}
            onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
          >
            {[1, 2, 3, 4, 5, 6].map(y => (
              <option key={y} value={y}>{y}{y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'} Year</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
          <Info className="w-3.5 h-3.5" /> Bio
        </label>
        <textarea
          className="w-full h-32 bg-surface-2 border border-border-accent rounded-xl p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
          placeholder="Tell us about your academic interests..."
          maxLength={160}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
        <p className="text-[10px] text-right text-muted font-bold uppercase tracking-widest">{formData.bio.length}/160</p>
      </div>

      {hasChanges && (
        <div className="flex justify-end pt-6">
          <Button 
            onClick={handleSave} 
            loading={loading}
            className="px-10 h-12 rounded-xl shadow-glow"
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
