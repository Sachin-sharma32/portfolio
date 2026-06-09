import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border font-mono text-xs uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default: 'border-line bg-secondary px-3 py-1 text-muted-bright',
        accent: 'border-accent/40 bg-accent/5 px-3 py-1 text-accent',
        bare: 'border-transparent px-0 py-0 text-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
