'use client';

import { useCallback, useMemo } from 'react';

import { printHtmlElement } from '../engine/printReactTree';
import type { ReactToPrintOptions } from '../types/PrintOptions';

type UseReactToPrintReturn = {
    handlePrint: () => Promise<void>;
};

export function useReactToPrint({ contentRef, ...options }: ReactToPrintOptions): UseReactToPrintReturn {
    // ----------------------------------------------------------------------------------------------------
    // MARK: States & Constants
    // ----------------------------------------------------------------------------------------------------
    const printOptions = useMemo(() => options, [options]);

    // ----------------------------------------------------------------------------------------------------
    // MARK: Handlers
    // ----------------------------------------------------------------------------------------------------
    const handlePrint = useCallback(async (): Promise<void> => {
        const element = contentRef.current;

        if (!element) {
            return;
        }

        await printHtmlElement(element, printOptions);
    }, [contentRef, printOptions]);

    return { handlePrint };
}
