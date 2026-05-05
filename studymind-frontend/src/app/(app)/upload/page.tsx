'use client';

import { Metadata } from 'next';

// This will be used by the layout or wrapper if needed, 
// but since it's a client component, we'll keep it here for reference 
// or move to a separate layout/wrapper.
// Actually, Next.js 13+ client components can't export metadata.
// I'll create a layout.tsx for the upload route to handle metadata.


import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Settings, 
  Upload as UploadIcon, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropZone } from '@/components/upload/DropZone';
import { UploadForm } from '@/components/upload/UploadForm';
import { ProcessingState } from '@/components/upload/ProcessingState';
import { SuccessState } from '@/components/upload/SuccessState';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function UploadPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState<1 | 2 | 3 | 4>(1);
  const [uploadedPaper, setUploadedPaper] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    subject: 'Select Subject',
    year: '2024',
    tags: [] as string[],
    isPublic: true,
  });

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      // Clean up filename for initial title
      const cleanTitle = selectedFile.name.replace('.pdf', '').replace(/[-_]/g, ' ');
      setFormData(prev => ({ ...prev, title: cleanTitle }));
      setStep(2);
    } else {
      setStep(1);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStep(3);
    setProcessingStage(1);

    try {
      // Stage 1: Upload to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from('papers')
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from('papers')
        .getPublicUrl(filePath);

      // Stage 2: Extracting (Simulated)
      setProcessingStage(2);
      await new Promise(r => setTimeout(r, 2000));

      // Stage 3: Analyzing (Simulated API call)
      setProcessingStage(3);
      const { data: { user } } = await supabase.auth.getUser();
      
      const paperData = {
        title: formData.title,
        subject: formData.subject,
        exam_year: parseInt(formData.year),
        file_url: publicUrl,
        file_path: filePath,
        is_public: formData.isPublic,
        tags: formData.tags,
        user_id: user?.id
      };

      // In a real app, the backend would handle extraction and AI analysis
      // We'll call our FastAPI backend here
      const response = await axios.post('/api/papers/upload', paperData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Stage 4: Finalizing
      setProcessingStage(4);
      await new Promise(r => setTimeout(r, 1000));

      setUploadedPaper(response.data);
      setStep(4);
      toast.success('Paper analyzed successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload paper');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: "Choose File", icon: UploadIcon },
    { id: 2, label: "Add Details", icon: Settings },
    { id: 3, label: "Processing", icon: FileText },
  ];

  return (
    <div className="max-w-[720px] mx-auto space-y-12 pb-20">
      {/* Step Indicator */}
      <div className="flex items-center justify-between relative px-4">
        {/* Connecting Line */}
        <div className="absolute top-5 left-10 right-10 h-0.5 bg-border-accent -z-10" />
        <div 
          className="absolute top-5 left-10 h-0.5 bg-primary transition-all duration-500 -z-10" 
          style={{ width: `${(Math.min(step, 3) - 1) * 50}%` }}
        />

        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
              step > s.id ? "bg-success text-white" : 
              step === s.id ? "bg-primary text-white shadow-glow scale-110" : 
              "bg-surface-2 text-muted"
            )}>
              {step > s.id ? <CheckCircle size={20} /> : <s.icon size={20} />}
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              step === s.id ? "text-foreground" : "text-muted"
            )}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-heading font-black">Upload Exam Paper</h1>
                <p className="text-muted text-sm font-medium">Select a PDF to begin AI analysis</p>
              </div>
              <DropZone file={file} onFileSelect={handleFileSelect} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-heading font-black">Paper Details</h1>
                  <p className="text-muted text-xs font-medium uppercase tracking-widest mt-1">Refine information for better AI results</p>
                </div>
                <button 
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-muted hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Change File
                </button>
              </div>
              <UploadForm 
                data={formData} 
                onChange={setFormData} 
                onSubmit={handleUpload}
                loading={loading}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ProcessingState stage={processingStage} />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SuccessState 
                paper={uploadedPaper} 
                onReset={() => {
                  setStep(1);
                  setFile(null);
                  setUploadedPaper(null);
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Help Banner */}
      {step < 3 && (
        <div className="p-4 bg-surface-2 rounded-2xl border border-border-accent flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold">Supported Formats</p>
            <p className="text-xs text-muted leading-relaxed">
              We currently only support text-based PDF exam papers. Scanned images may result in lower accuracy. 
              Max file size is 20MB.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
