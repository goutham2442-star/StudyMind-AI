'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard, Search } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen w-full bg-[#0A0A0F] flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: 0.05
            }}
            animate={{ 
              y: [null, '-20px', '20px', null],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute text-primary font-black text-4xl select-none"
          >
            ?
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-lg">
        {/* Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-64 h-64 mx-auto"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-glow">
             <path d="M100 20C55.8 20 20 55.8 20 100C20 144.2 55.8 180 100 180C144.2 180 180 144.2 180 100C180 55.8 144.2 20 100 20ZM100 160C66.9 160 40 133.1 40 100C40 66.9 66.9 40 100 40C133.1 40 160 66.9 160 100C160 133.1 133.1 160 100 160Z" fill="currentColor" className="text-primary/20" />
             <motion.circle 
              cx="100" cy="100" r="30" 
              fill="currentColor" 
              className="text-primary"
              animate={{ r: [30, 35, 30] }}
              transition={{ duration: 2, repeat: Infinity }}
             />
             <motion.path 
              d="M70 140Q100 110 130 140" 
              stroke="currentColor" 
              strokeWidth="8" 
              strokeLinecap="round" 
              className="text-white"
              animate={{ d: ["M70 140Q100 110 130 140", "M75 145Q100 120 125 145", "M70 140Q100 110 130 140"] }}
              transition={{ duration: 3, repeat: Infinity }}
             />
          </svg>
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-6xl font-heading font-black tracking-tighter text-white">404</h1>
          <h2 className="text-2xl font-bold text-foreground">Lost in the library?</h2>
          <p className="text-muted text-sm max-w-sm mx-auto leading-relaxed">
            The page you're looking for has vanished into the academic void. Don't worry, even the best students get lost sometimes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full h-12 px-8 rounded-xl shadow-glow">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Go to Dashboard
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full h-12 px-8 rounded-xl">
              <Home className="w-4 h-4 mr-2" /> Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
