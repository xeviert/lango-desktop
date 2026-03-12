import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScoreBadge } from '@/components/gamification/ScoreBadge';
import { ProgressRing } from '@/components/gamification/ProgressRing';
import type { Word } from '../../../../../shared/types';

interface WordPoolViewProps {
  words: Word[];
  score: number;
  onStartPractice: () => void;
}

function getWordVariant(word: Word): 'success' | 'danger' | 'neutral' {
  if (word.correct_count >= 3) return 'success';
  if (word.incorrect_count > word.correct_count && word.incorrect_count > 0) return 'danger';
  return 'neutral';
}

export function WordPoolView({ words, score, onStartPractice }: WordPoolViewProps) {
  const masteredCount = words.filter((w) => w.correct_count >= 3).length;

  return (
    <Card className="overflow-hidden">
      <CardContent className="py-6 px-5">
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-4 mb-4">
            <ScoreBadge score={score} />
            <ProgressRing value={masteredCount} max={words.length} />
          </div>
          <h2 className="text-xl font-extrabold text-[#1a202c] mt-3 mb-1">Your Word Bank</h2>
          <p className="text-sm text-[#718096]">{words.length} French words to master</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 p-1 mb-5 max-h-[300px] overflow-y-auto">
          {words.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.015, 1), duration: 0.2 }}
            >
              <Badge variant={getWordVariant(w)} className="text-sm cursor-default">
                {w.original}
              </Badge>
            </motion.div>
          ))}
        </div>

        <Button
          variant="gradient"
          size="lg"
          className="w-full"
          onClick={onStartPractice}
        >
          Start Practicing
        </Button>
      </CardContent>
    </Card>
  );
}
