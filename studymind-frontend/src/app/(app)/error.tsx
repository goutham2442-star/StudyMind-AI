'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Route Error:', error);
  }, [error]);

  return (
    <div className="h-[70vh] w-full flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="space-y-8 max-w-md"
      >
        <div className="w-20 h-20 bg-error/10 rounded-3xl flex items-center justify-center mx-auto text-error shadow-glow shadow-error/20">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-heading font-black tracking-tight">Something went wrong!</h1>
          <p className="text-muted text-sm leading-relaxed">
            An unexpected error occurred while loading this section. Our AI tutors are looking into it.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted/50 uppercase tracking-widest mt-4">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button onClick={() => reset()} className="w-full sm:w-auto h-11 px-8 rounded-xl shadow-glow">
            <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full sm:w-auto h-11 px-8 rounded-xl">
              <Home className="w-4 h-4 mr-2" /> Back Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
