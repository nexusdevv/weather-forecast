'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
}

export default function FadeIn({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  y = 20, 
  x = 0,
  className = '' 
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 