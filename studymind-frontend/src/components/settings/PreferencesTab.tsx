'use client';

import { useState } from 'react';
import { 
  Brain, 
  Globe, 
  Zap, 
  Bell, 
  Check,
  Layout
} from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export function PreferencesTab() {
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState({
    responseStyle: 'detailed',
    language: 'English',
    autoGenQuestions: true,
    autoGenSummary: true,
    showSuggestions: true,
    emailNotifications: true,
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Preferences saved');
    }, 1000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* AI Behavior */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Brain size={18} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em]">AI Behavior</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StyleOption 
            active={prefs.responseStyle === 'detailed'} 
            onClick={() => setPrefs({ ...prefs, responseStyle: 'detailed' })}
            label="Detailed"
            desc="Full explanations"
          />
          <StyleOption 
            active={prefs.responseStyle === 'concise'} 
            onClick={() => setPrefs({ ...prefs, responseStyle: 'concise' })}
            label="Concise"
            desc="Direct answers"
          />
          <StyleOption 
            active={prefs.responseStyle === 'bullets'} 
            onClick={() => setPrefs({ ...prefs, responseStyle: 'bullets' })}
            label="Bullets"
            desc="Structured lists"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Response Language</label>
          <select
            className="w-full h-11 bg-surface-2 border border-border-accent rounded-xl px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            value={prefs.language}
            onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
          >
            {['English', 'Tamil', 'Hindi', 'Telugu'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </section>

      {/* Study Features */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
            <Zap size={18} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em]">Study Features</h3>
        </div>

        <div className="space-y-4">
          <PreferenceToggle 
            checked={prefs.autoGenQuestions} 
            onChange={(v) => setPrefs({ ...prefs, autoGenQuestions: v })}
            label="Auto-generate exam questions on upload"
          />
          <PreferenceToggle 
            checked={prefs.autoGenSummary} 
            onChange={(v) => setPrefs({ ...prefs, autoGenSummary: v })}
            label="Auto-generate summary on upload"
          />
          <PreferenceToggle 
            checked={prefs.showSuggestions} 
            onChange={(v) => setPrefs({ ...prefs, showSuggestions: v })}
            label="Show suggested questions in chat"
          />
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Bell size={18} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em]">Notifications</h3>
        </div>

        <PreferenceToggle 
          checked={prefs.emailNotifications} 
          onChange={(v) => setPrefs({ ...prefs, emailNotifications: v })}
          label="Email me when new papers are added to my department"
        />
      </section>

      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} loading={loading} className="px-10 h-12 rounded-xl">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

function StyleOption({ active, onClick, label, desc }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl border-2 transition-all text-left",
        active ? "border-primary bg-primary/5" : "border-border-accent bg-surface-2 hover:border-border-accent/80"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-bold">{label}</p>
        {active && <Check size={14} className="text-primary" />}
      </div>
      <p className="text-[10px] text-muted font-medium uppercase tracking-tight">{desc}</p>
    </button>
  );
}

function PreferenceToggle({ checked, onChange, label }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-surface-2 border border-border-accent rounded-xl">
      <span className="text-sm font-medium text-foreground/80">{label}</span>
      <button 
        onClick={() => onChange(!checked)}
        className={cn(
          "w-12 h-6 rounded-full transition-all relative p-1",
          checked ? "bg-primary" : "bg-border-accent"
        )}
      >
        <motion.div 
          animate={{ x: checked ? 24 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm" 
        />
      </button>
    </div>
  );
}
