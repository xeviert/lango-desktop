import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScoreBadge } from '@/components/gamification/ScoreBadge';
import { ConfettiEffect } from '@/components/gamification/ConfettiEffect';
import { StreakCounter } from '@/components/gamification/StreakCounter';

interface ResultsViewProps {
  isCorrect: boolean;
  guess: string;
  original: string;
  translation: string;
  score: number;
  previousScore: number;
  streak: number;
  onNext: () => void;
}

export function ResultsView({
  isCorrect,
  guess,
  original,
  translation,
  score,
  previousScore,
  streak,
  onNext,
}: ResultsViewProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const scoreDelta = score - previousScore;

  useEffect(() => {
    if (isCorrect) {
      setShowConfetti(true);
    }
  }, [isCorrect]);

  return (
    <div className="relative">
      <ConfettiEffect trigger={showConfetti} />

      <Card
        className={cn(
          'border-l-[5px] overflow-hidden',
          isCorrect
            ? 'bg-green-correct-bg border-l-green-correct'
            : 'bg-red-incorrect-bg border-l-red-incorrect'
        )}
      >
        <CardContent className="py-8 px-6 text-center">
          <motion.div
            initial={isCorrect ? { scale: 0.3, opacity: 0 } : { x: 0 }}
            animate={
              isCorrect
                ? { scale: 1, opacity: 1 }
                : { x: [0, -4, 4, -4, 4, 0] }
            }
            transition={
              isCorrect
                ? { type: 'spring', stiffness: 300, damping: 15 }
                : { duration: 0.5 }
            }
            className={cn(
              'mb-6 text-3xl font-extrabold tracking-tight',
              isCorrect ? 'text-green-correct-text' : 'text-red-incorrect-text'
            )}
          >
            {isCorrect ? 'Correct!' : 'Not quite!'}
          </motion.div>

          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="w-full max-w-[340px] py-3 px-4 rounded-xl border-2 border-gray-200 bg-white shadow-sm flex flex-col items-center gap-1">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-400">
                Word
              </span>
              <span className="text-xl font-bold text-[#2d3748]">{original}</span>
            </div>

            {!isCorrect && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[340px] py-3 px-4 rounded-xl border-2 border-red-incorrect bg-white shadow-sm flex flex-col items-center gap-1"
              >
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-400">
                  Your answer
                </span>
                <span className="text-xl font-bold text-red-incorrect-text line-through opacity-80">
                  {guess}
                </span>
              </motion.div>
            )}

            <div className="w-full max-w-[340px] py-3 px-4 rounded-xl border-2 border-green-correct bg-white shadow-sm flex flex-col items-center gap-1">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-400">
                Correct answer
              </span>
              <span className="text-xl font-bold text-green-correct-text">{translation}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-5">
            <ScoreBadge score={score} />
            {scoreDelta !== 0 && (
              <motion.span
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -20, opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' as const }}
                className={cn(
                  'text-sm font-bold',
                  scoreDelta > 0 ? 'text-green-correct' : 'text-red-incorrect'
                )}
              >
                {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta}
              </motion.span>
            )}
            {isCorrect && streak > 2 && <StreakCounter streak={streak} />}
          </div>

          <Button
            variant={isCorrect ? 'success' : 'warning'}
            size="lg"
            onClick={onNext}
          >
            {isCorrect ? 'Keep it up! Next word' : 'Try another word'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
