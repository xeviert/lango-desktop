import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-500',
        destructive: 'bg-red-incorrect text-white hover:brightness-90 focus-visible:ring-red-incorrect',
        outline: 'border-2 border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        ghost: 'hover:bg-gray-100 text-gray-700',
        link: 'text-blue-500 underline-offset-4 hover:underline',
        gradient: 'bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:brightness-110 hover:-translate-y-px active:translate-y-0',
        success: 'bg-green-correct text-white hover:brightness-90 focus-visible:ring-green-correct',
        warning: 'bg-orange-incorrect-btn text-white hover:brightness-90 focus-visible:ring-orange-500',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
