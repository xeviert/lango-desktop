import { useCallback } from 'react';

export function useFrenchTTS() {
  const speak = useCallback((word: string) => {
    const src = `/audio/${encodeURIComponent(word)}.mp3`;
    const audio = new Audio(src);
    audio.play().catch(() => {});
  }, []);

  return { speak };
}
