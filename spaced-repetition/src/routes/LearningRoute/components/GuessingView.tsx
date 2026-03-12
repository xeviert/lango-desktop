import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScoreBadge } from '@/components/gamification/ScoreBadge';
import { StatsPills } from '@/components/gamification/StatsPills';
import { StreakCounter } from '@/components/gamification/StreakCounter';

interface GuessingViewProps {
  nextWord: string;
  score: number;
  correctCount: number;
  incorrectCount: number;
  streak: number;
  onGuess: (guess: string) => void;
}

export function GuessingView({
  nextWord,
  score,
  correctCount,
  incorrectCount,
  streak,
  onGuess,
}: GuessingViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [nextWord]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    if (value) {
      onGuess(value);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <ScoreBadge score={score} />
          <StreakCounter streak={streak} />
        </div>

        <Card className="border-b-4 border-b-blue-500 animate-float">
          <CardContent className="py-7 px-5 flex flex-col items-center gap-2">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-gray-400">
              Translate
            </span>
            <motion.span
              key={nextWord}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-4xl font-extrabold text-[#1a202c] block"
            >
              {nextWord}
            </motion.span>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSubmit} className="text-center space-y-3">
        <Label htmlFor="guess-input" className="text-blue-600 block">
          What's your translation?
        </Label>
        <Input
          ref={inputRef}
          id="guess-input"
          name="guess-input"
          placeholder="Type your answer..."
          className="w-4/5 mx-auto text-center h-12 text-base"
          required
          autoComplete="off"
        />
        <p className="text-xs text-gray-400">Press Enter to submit</p>
        <Button variant="gradient" size="lg" type="submit" className="w-4/5">
          Submit
        </Button>
      </form>

      <StatsPills correctCount={correctCount} incorrectCount={incorrectCount} className="mt-6" />
    </div>
  );
}
