'use client';

import { useCallback } from 'react';

import { printReactTree } from '../engine/printReactTree';
import type { PrintOptions, PrintRequest } from '../types/PrintOptions';

type UsePrinterReturn = {
    print: (request: PrintRequest) => Promise<void>;
};

export function usePrinter(overrides: PrintOptions = {}): UsePrinterReturn {
    // ----------------------------------------------------------------------------------------------------
    // MARK: Handlers
    // ----------------------------------------------------------------------------------------------------
    const print = useCallback(
        async (request: PrintRequest): Promise<void> => {
            const { component, ...requestOptions } = request;

            await printReactTree({
                ...overrides,
                ...requestOptions,
                component,
            });
        },
        [overrides],
    );

    return { print };
}
