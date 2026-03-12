import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  className?: string;
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  return (
    <div className={cn('inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full border-2 border-blue-500 bg-blue-50 text-blue-600', className)}>
      <span className="text-xs font-bold uppercase tracking-wide">Score</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={score}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="text-lg font-extrabold"
        >
          {score}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
