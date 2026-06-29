'use client';

import type { ComponentProps, JSX, ReactNode } from 'react';

import { cn } from '../utils/cn';

type PrintSheetProps = {
    children: ReactNode;
    className?: string;
};

export function PrintSheet({ children, className }: PrintSheetProps): JSX.Element {
    // ----------------------------------------------------------------------------------------------------
    // MARK: Main Component UI
    // ----------------------------------------------------------------------------------------------------
    return (
        <div
            className={cn(
                'mx-auto w-full max-w-3xl bg-background p-1 text-foreground print:max-w-none print:p-0',
                className,
            )}
        >
            {children}
        </div>
    );
}

type PrintSectionProps = ComponentProps<'section'>;

export function PrintSection({ children, className, ...props }: PrintSectionProps): JSX.Element {
    // ----------------------------------------------------------------------------------------------------
    // MARK: Main Component UI
    // ----------------------------------------------------------------------------------------------------
    return (
        <section className={cn('rounded-xl border border-border bg-card text-card-foreground', className)} {...props}>
            {children}
        </section>
    );
}
