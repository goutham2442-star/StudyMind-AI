'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    text: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 glass rounded-2xl border-dashed">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center mb-6"
      >
        <Icon className="w-8 h-8 text-muted" />
      </motion.div>
      
      <h3 className="text-xl font-heading font-bold mb-2">{title}</h3>
      <p className="text-muted text-sm max-w-xs mb-8 leading-relaxed">
        {description}
      </p>

      {action && (
        <Button onClick={action.onClick} variant="secondary">
          {action.text}
        </Button>
      )}
    </div>
  );
}
