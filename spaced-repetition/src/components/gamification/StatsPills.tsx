import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface StatsPillsProps {
  correctCount: number;
  incorrectCount: number;
  className?: string;
}

export function StatsPills({ correctCount, incorrectCount, className }: StatsPillsProps) {
  return (
    <div className={cn('flex justify-center gap-3', className)}>
      <div className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-bold bg-green-correct-bg text-green-correct-text border-[1.5px] border-green-correct">
        <Check className="w-3.5 h-3.5" />
        {correctCount} correct
      </div>
      <div className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-bold bg-red-incorrect-bg text-red-incorrect-text border-[1.5px] border-red-incorrect">
        <X className="w-3.5 h-3.5" />
        {incorrectCount} incorrect
      </div>
    </div>
  );
}
