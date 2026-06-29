import { createElement, type Context, type ReactElement } from 'react';

import type { PrintWrapper } from '../types/PrintOptions';

export function createContextPrintWrapper<T>(context: Context<T>, value: T): PrintWrapper {
    return (component: ReactElement) => createElement(context.Provider, { value }, component);
}

export function chainPrintWrappers(
    ...wrappers: Array<PrintWrapper | undefined>
): PrintWrapper | undefined {
    const active = wrappers.filter((wrapper): wrapper is PrintWrapper => wrapper !== undefined);

    if (active.length === 0) {
        return undefined;
    }

    if (active.length === 1) {
        return active[0];
    }

    return (component) => active.reduce((wrapped, wrap) => wrap(wrapped), component);
}
