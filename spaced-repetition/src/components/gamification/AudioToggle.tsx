import { Volume2, VolumeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioToggleProps {
  enabled: boolean;
  onToggle: () => void;
  className?: string;
}

export function AudioToggle({ enabled, onToggle, className }: AudioToggleProps) {
  const Icon = enabled ? Volume2 : VolumeOff;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'inline-flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors',
        enabled
          ? 'border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100'
          : 'border-gray-300 bg-gray-50 text-gray-400 hover:bg-gray-100',
        className,
      )}
      aria-label={enabled ? 'Mute audio' : 'Unmute audio'}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
