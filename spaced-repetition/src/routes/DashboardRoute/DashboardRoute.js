import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

const PHASES = [
  { step: 1, title: 'Word Flashcards', description: 'Build vocabulary with spaced repetition', path: '/learn', unlocked: true },
  { step: 2, title: 'Coming Soon', description: 'Next phase unlocks after mastering Phase 1', path: null, unlocked: false },
  { step: 3, title: 'Coming Soon', description: 'More challenges ahead', path: null, unlocked: false },
];

function DashboardRoute() {
  return (
    <section className='max-w-md mx-auto pt-16 px-6 text-center'>
      <div className='mb-12'>
        <h1 className='text-[3rem] font-extrabold bg-linear-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent mb-2'>Lango</h1>
        <p className='text-lg text-gray-400'>Your French Learning Journey</p>
      </div>

      <div className='flex flex-col items-center'>
        {PHASES.map((phase, index) => (
          <div key={phase.step} className='w-full'>
            <div className='flex items-center gap-4 w-full'>
              <div className={cx(
                'w-11 h-11 rounded-full flex items-center justify-center text-[1.1rem] font-extrabold shrink-0',
                phase.unlocked ? 'bg-linear-to-br from-blue-500 to-teal-400 text-white' : 'bg-gray-locked-bg text-gray-locked'
              )}>
                {phase.unlocked ? phase.step : '🔒'}
              </div>
              <div className={cx(
                'flex-1 rounded-[10px] py-3.5 px-[18px] text-left border-l-4',
                phase.unlocked
                  ? 'bg-white/60 backdrop-blur-sm border border-gray-200 border-l-blue-500'
                  : 'bg-white/30 backdrop-blur-sm border-l-dashed border-l-gray-300 text-gray-400'
              )}>
                <div className={cx('text-[0.95rem] font-bold mb-1', phase.unlocked ? 'text-[#1a202c]' : 'text-gray-400')}>Phase {phase.step} — {phase.title}</div>
                <div className={cx('text-[0.8rem]', phase.unlocked ? 'text-[#718096] mb-2.5' : 'text-gray-400 mb-0')}>
                  {phase.description}
                </div>
                {phase.unlocked && (
                  <Link to={phase.path} className='inline-block py-2 px-5 rounded-md bg-linear-to-r from-blue-500 to-teal-400 text-white text-[0.9rem] font-semibold no-underline transition-[filter,transform] duration-200 hover:brightness-110 hover:-translate-y-px active:translate-y-0'>
                    Start →
                  </Link>
                )}
              </div>
            </div>
            {index < PHASES.length - 1 && <div className='w-px h-7 border-l border-dashed border-gray-300 ml-[21px]' />}
          </div>
        ))}
      </div>
    </section>
  );
}

export default DashboardRoute;
