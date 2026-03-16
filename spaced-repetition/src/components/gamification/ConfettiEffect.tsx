import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const COLORS = ['#3b82f6', '#2dd4bf', '#38a169', '#fbbf24', '#f472b6'];
const PARTICLE_COUNT = 12;

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
}

export function ConfettiEffect({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      setParticles(
        Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 200 - 100,
          color: COLORS[i % COLORS.length],
          delay: Math.random() * 0.3,
          rotation: Math.random() * 720 - 360,
        }))
      );
      const timer = setTimeout(() => setParticles([]), 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '50%', x: '50%', opacity: 1, scale: 1 }}
          animate={{
            y: [0, -120 - Math.random() * 80],
            x: [0, p.x],
            opacity: [1, 1, 0],
            rotate: p.rotation,
            scale: [1, 0.5],
          }}
          transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' as const }}
          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
