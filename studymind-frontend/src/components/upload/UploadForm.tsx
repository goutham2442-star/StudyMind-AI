'use client';

import { Input, Button } from '@/components/ui';
import { 
  FileText, 
  BookOpen, 
  Calendar, 
  Tag as TagIcon, 
  Globe, 
  Lock,
  X
} from 'lucide-react';
import { SUBJECTS, YEARS } from '@/constants';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface UploadFormProps {
  data: any;
  onChange: (data: any) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function UploadForm({ data, onChange, onSubmit, loading }: UploadFormProps) {
  const [tagInput, setTagInput] = useState('');

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!data.tags.includes(tagInput.trim())) {
        onChange({ ...data, tags: [...data.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    onChange({ ...data, tags: data.tags.filter((t: string) => t !== tag) });
  };

  const isValid = data.title && data.subject && data.subject !== 'Select Subject' && data.year;

  return (
    <div className="space-y-6">
      <Input
        label="Paper Title"
        placeholder="e.g. Computer Networks - Final Exam 2023"
        icon={FileText}
        value={data.title}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" /> Subject
          </label>
          <select
            className="w-full h-11 bg-surface-2 border border-border-accent rounded-xl px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
            value={data.subject}
            onChange={(e) => onChange({ ...data, subject: e.target.value })}
          >
            <option disabled value="Select Subject">Select Subject</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            <option value="Other">Other</option>
          </select>
        </div>

        <Input
          label="Exam Year"
          placeholder="2024"
          type="number"
          min={2015}
          max={2025}
          icon={Calendar}
          value={data.year}
          onChange={(e) => onChange({ ...data, year: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
          <TagIcon className="w-3.5 h-3.5" /> Tags
        </label>
        <div className="flex flex-wrap gap-2 p-2 bg-surface-2 border border-border-accent rounded-xl min-h-[44px]">
          {data.tags.map((tag: string) => (
            <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            placeholder={data.tags.length === 0 ? "Type and press Enter to add tags..." : ""}
            className="flex-1 bg-transparent border-none outline-none text-sm px-2 min-w-[150px]"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Visibility</label>
        <div className="grid grid-cols-2 gap-4">
          <VisibilityOption 
            active={data.isPublic} 
            onClick={() => onChange({ ...data, isPublic: true })}
            icon={Globe}
            label="Public"
            desc="Shared with everyone"
          />
          <VisibilityOption 
            active={!data.isPublic} 
            onClick={() => onChange({ ...data, isPublic: false })}
            icon={Lock}
            label="Private"
            desc="Only you can see this"
          />
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={!isValid || loading}
        className="w-full h-14 text-lg font-black uppercase tracking-widest mt-8 group"
      >
        Upload & Analyze Paper 🚀
      </Button>
    </div>
  );
}

function VisibilityOption({ active, onClick, icon: Icon, label, desc }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left",
        active ? "border-primary bg-primary/5" : "border-border-accent bg-surface-2 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
      )}
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", active ? "bg-primary text-white" : "bg-surface text-muted")}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-bold">{label}</p>
        <p className="text-[10px] text-muted uppercase tracking-tight">{desc}</p>
      </div>
    </button>
  );
}
