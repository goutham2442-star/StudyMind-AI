'use client';

import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface DropZoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export function DropZone({ file, onFileSelect }: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 20 * 1024 * 1024, // 20MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error('File is too large (max 20MB)');
      } else if (error?.code === 'file-invalid-type') {
        toast.error('Only PDF files are allowed');
      } else {
        toast.error('Upload failed');
      }
    }
  });

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            {...getRootProps()}
            className={cn(
              "relative h-72 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden",
              isDragActive 
                ? "border-primary bg-primary/5 scale-[0.99]" 
                : "border-border-accent hover:border-primary/50 bg-surface/50"
            )}
          >
            <input {...getInputProps()} />
            
            <motion.div
              animate={isDragActive ? { y: [0, -10, 0] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className={cn(
                "w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mb-4 transition-all group-hover:shadow-glow",
                isDragActive ? "text-primary shadow-glow" : "text-muted group-hover:text-primary"
              )}
            >
              <Upload className="w-8 h-8" />
            </motion.div>

            <h3 className="text-lg font-heading font-bold">Drop your PDF here</h3>
            <p className="text-muted text-sm mt-2">or click to browse from your device</p>
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-6">Max size: 20MB</p>

            {/* Decorative background circle */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
          </motion.div>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-6 rounded-3xl border-primary/30 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-linear-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-glow text-white">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-foreground truncate max-w-[250px]">{file.name}</h4>
                <div className="flex items-center gap-3 text-xs text-muted font-medium mt-1">
                  <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  <span className="w-1 h-1 bg-muted rounded-full" />
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle className="w-3 h-3" /> Ready to upload
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => onFileSelect(null)}
              className="p-2 rounded-xl bg-surface-2 text-muted hover:text-error hover:bg-error/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
