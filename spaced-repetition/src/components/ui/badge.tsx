import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-blue-500 text-white',
        secondary: 'border-transparent bg-gray-200 text-gray-800',
        destructive: 'border-transparent bg-red-incorrect text-white',
        outline: 'border-2 text-gray-700',
        success: 'border-green-correct bg-green-correct-bg text-green-correct-text border-[1.5px]',
        danger: 'border-red-incorrect bg-red-incorrect-bg text-red-incorrect-text border-[1.5px]',
        neutral: 'border-gray-300 bg-gray-100 text-gray-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
