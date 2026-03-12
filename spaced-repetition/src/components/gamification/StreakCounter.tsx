import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  streak: number;
  className?: string;
}

export function StreakCounter({ streak, className }: StreakCounterProps) {
  if (streak < 2) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className={cn(
          'inline-flex items-center gap-1 py-1 px-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold',
          className
        )}
      >
        <Flame className="w-3.5 h-3.5" />
        {streak} streak!
      </motion.div>
    </AnimatePresence>
  );
}
