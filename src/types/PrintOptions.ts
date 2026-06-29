import type { ReactElement, RefObject } from 'react';

export type PrintPaperSize = 'A4' | 'A5' | 'Letter';

export type PrintOrientation = 'portrait' | 'landscape';

export type PrintMarginUnit = 'mm' | 'px';

export type PrintOptions = {
    paper?: PrintPaperSize;
    orientation?: PrintOrientation;
    margin?: number;
    marginUnit?: PrintMarginUnit;
    title?: string;
};

export type PrintRequest = PrintOptions & {
    component: ReactElement;
};

export type ReactToPrintOptions = PrintOptions & {
    contentRef: RefObject<HTMLElement | null>;
};
