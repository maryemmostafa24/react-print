'use client';

import type { JSX, ReactElement, ReactNode } from 'react';

import { usePrinter } from '../hooks/usePrinter';
import type { PrintOptions } from '../types/PrintOptions';

export type PrintProps = {
    component: ReactElement;
    options?: PrintOptions;
    children?: (controls: { onPrint: () => void }) => ReactNode;
};

export function Print({ component, children, options = {} }: PrintProps): JSX.Element | null {
    // ----------------------------------------------------------------------------------------------------
    // MARK: States & Constants
    // ----------------------------------------------------------------------------------------------------
    const { print } = usePrinter();

    // ----------------------------------------------------------------------------------------------------
    // MARK: Handlers
    // ----------------------------------------------------------------------------------------------------
    function onPrint(): void {
        void print({
            ...options,
            component,
        });
    }

    // ----------------------------------------------------------------------------------------------------
    // MARK: Main Component UI
    // ----------------------------------------------------------------------------------------------------
    if (children) {
        return <>{children({ onPrint })}</>;
    }

    return null;
}
