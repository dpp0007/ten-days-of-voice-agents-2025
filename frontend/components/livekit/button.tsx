import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'text-xs font-bold tracking-wider uppercase whitespace-nowrap',
    'inline-flex items-center justify-center gap-2 shrink-0 rounded-full cursor-pointer outline-none transition-colors duration-300',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40 ',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: 'glass text-foreground hover:bg-white/10 focus:bg-white/10 border border-white/10',
        destructive: [
          'bg-[#FF6B6B] text-white border-0',
          'hover:bg-[#FF5252] focus:bg-[#FF5252]',
          'shadow-md hover:shadow-lg transition-all',
        ],
        outline: [
          'glass border border-white/15',
          'hover:bg-white/10 hover:border-white/20',
        ],
        primary: 'glass bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30 focus:bg-cyan-500/30',
        secondary: 'bg-white/30 backdrop-blur-sm text-gray-700 hover:bg-white/40 border border-white/40 shadow-sm',
        ghost: 'hover:bg-white/5 hover:text-accent-foreground',
        link: 'text-cyan-400 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
