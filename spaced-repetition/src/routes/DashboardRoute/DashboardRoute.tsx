import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import LanguageApiService from '@/services/language-api-service';

interface Phase {
  step: number;
  title: string;
  description: string;
  path: string | null;
  unlocked: boolean;
}

const PHASES: Phase[] = [
  { step: 1, title: 'Word Flashcards', description: 'Build vocabulary with spaced repetition', path: '/learn', unlocked: true },
  { step: 2, title: 'Coming Soon', description: 'Next phase unlocks after mastering Phase 1', path: null, unlocked: false },
  { step: 3, title: 'Coming Soon', description: 'More challenges ahead', path: null, unlocked: false },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.4, ease: 'easeOut' as const },
  }),
};

export default function DashboardRoute() {
  const [totalWords, setTotalWords] = useState(0);
  const [practicedWords, setPracticedWords] = useState(0);

  useEffect(() => {
    LanguageApiService.getLanguageAndWords()
      .then((data) => {
        setTotalWords(data.words.length);
        const practiced = data.words.filter(
          (w) => w.correct_count > 0 || w.incorrect_count > 0
        ).length;
        setPracticedWords(practiced);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="max-w-md mx-auto pt-12 px-6 text-center">
      <div className="mb-10">
        <motion.h1
          className="text-[3rem] font-extrabold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent mb-2"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
        >
          Lango
        </motion.h1>
        <p className="text-lg text-gray-400">Your French Learning Journey</p>
      </div>

      {totalWords > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Progress
            </span>
            <span className="font-semibold text-gray-700">
              {practicedWords}/{totalWords} words practiced
            </span>
          </div>
          <Progress value={practicedWords} max={totalWords} />
        </motion.div>
      )}

      <div className="flex flex-col items-center">
        {PHASES.map((phase, index) => (
          <div key={phase.step} className="w-full">
            <motion.div
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <div className="flex items-center gap-4 w-full">
                <div
                  className={cn(
                    'w-11 h-11 rounded-full flex items-center justify-center text-[1.1rem] font-extrabold shrink-0 transition-transform',
                    phase.unlocked
                      ? 'bg-gradient-to-br from-blue-500 to-teal-400 text-white'
                      : 'bg-gray-locked-bg text-gray-locked'
                  )}
                >
                  {phase.unlocked ? phase.step : <Lock className="w-4 h-4" />}
                </div>
                {phase.unlocked ? (
                  <Card className="flex-1 border-l-4 border-l-blue-500 hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200">
                    <CardContent className="py-3.5 px-[18px]">
                      <div className="text-[0.95rem] font-bold mb-1 text-[#1a202c] text-left">
                        Phase {phase.step} — {phase.title}
                      </div>
                      <div className="text-[0.8rem] text-[#718096] mb-2.5 text-left">
                        {phase.description}
                      </div>
                      <Button variant="gradient" size="sm" asChild>
                        <Link to={phase.path!}>Start</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card className="flex-1 bg-white/30 border-l-4 border-l-gray-300 border-dashed opacity-70 cursor-default">
                        <CardContent className="py-3.5 px-[18px]">
                          <div className="text-[0.95rem] font-bold mb-1 text-gray-400 text-left">
                            Phase {phase.step} — {phase.title}
                          </div>
                          <div className="text-[0.8rem] text-gray-400 text-left">
                            {phase.description}
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      Complete Phase {phase.step - 1} first
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </motion.div>
            {index < PHASES.length - 1 && (
              <div className="w-px h-7 border-l border-dashed border-gray-300 ml-[21px]" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
