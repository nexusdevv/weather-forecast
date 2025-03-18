'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BlurInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export default function BlurIn({ 
  children, 
  duration = 0.7, 
  delay = 0,
  className = '' 
}: BlurInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 