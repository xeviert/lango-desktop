import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import Header from '@/components/Header/Header';
import DashboardRoute from '@/routes/DashboardRoute/DashboardRoute';
import LearningRoute from '@/routes/LearningRoute/LearningRoute';
import NotFoundRoute from '@/routes/NotFoundRoute/NotFoundRoute';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: 'easeInOut' as const },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return <motion.div {...pageTransition}>{children}</motion.div>;
}

export default function App() {
  const location = useLocation();

  return (
    <TooltipProvider>
      <ErrorBoundary>
        <div className="App min-h-screen">
          <Header />
          <main>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <AnimatedPage>
                      <DashboardRoute />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="/learn"
                  element={
                    <AnimatedPage>
                      <LearningRoute />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="*"
                  element={
                    <AnimatedPage>
                      <NotFoundRoute />
                    </AnimatedPage>
                  }
                />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </ErrorBoundary>
    </TooltipProvider>
  );
}
