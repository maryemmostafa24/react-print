'use client';

import type { ReactElement } from 'react';

import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';

import type { PrintOptions } from '../types/PrintOptions';

import { injectDocumentStyles } from './extractDocumentStyles';
import { resolvePrintPageCss } from './resolvePrintPageCss';
import { triggerPrint, waitForPrintResources } from './triggerPrint';

type PrintReactTreeParams = PrintOptions & {
    component: ReactElement;
};

// ----------------------------------------------------------------------------------------------------
// MARK: Functions
// ----------------------------------------------------------------------------------------------------
function applyPrintIframeStyles(iframe: HTMLIFrameElement): void {
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '-10000px';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    iframe.style.border = '0';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-1';
}

function createPrintIframe(title: string): { iframe: HTMLIFrameElement; iframeDocument: Document; iframeWindow: Window } {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('title', title);
    iframe.setAttribute('aria-hidden', 'true');
    applyPrintIframeStyles(iframe);
    document.body.appendChild(iframe);

    const iframeWindow = iframe.contentWindow;
    const iframeDocument = iframe.contentDocument ?? iframeWindow?.document;

    if (!iframeWindow || !iframeDocument) {
        iframe.remove();
        throw new Error('Unable to create print sandbox iframe.');
    }

    return { iframe, iframeDocument, iframeWindow };
}

function mountPrintRoot(iframeDocument: Document): { container: HTMLDivElement; root: Root } {
    iframeDocument.open();
    iframeDocument.write('<!DOCTYPE html><html><head></head><body></body></html>');
    iframeDocument.close();

    const container = iframeDocument.createElement('div');
    container.className = 'react-print-root';
    iframeDocument.body.appendChild(container);

    const root = createRoot(container);

    return { container, root };
}

function cleanupPrintSandbox(iframe: HTMLIFrameElement, root: Root | null): void {
    if (root) {
        root.unmount();
    }

    iframe.remove();
}

export async function printReactTree({
    component,
    title = 'Print',
    wrapper,
    ...options
}: PrintReactTreeParams): Promise<void> {
    const { iframe, iframeDocument, iframeWindow } = createPrintIframe(title);

    const { container, root } = mountPrintRoot(iframeDocument);

    if (title.trim().length > 0) {
        iframeDocument.title = title;
    }

    await injectDocumentStyles(iframeDocument, resolvePrintPageCss(options));

    const content = wrapper ? wrapper(component) : component;

    flushSync(() => {
        root.render(content);
    });

    await waitForPrintResources(container, iframeWindow);

    triggerPrint(iframeWindow, () => {
        cleanupPrintSandbox(iframe, root);
    });
}

export async function printHtmlElement(element: HTMLElement, options: PrintOptions = {}): Promise<void> {
    const title = options.title ?? 'Print';
    const { iframe, iframeDocument, iframeWindow } = createPrintIframe(title);

    iframeDocument.open();
    iframeDocument.write('<!DOCTYPE html><html><head></head><body></body></html>');
    iframeDocument.close();

    if (title.trim().length > 0) {
        iframeDocument.title = title;
    }

    await injectDocumentStyles(iframeDocument, resolvePrintPageCss(options));

    const container = iframeDocument.createElement('div');
    container.className = 'react-print-root';
    container.appendChild(element.cloneNode(true));
    iframeDocument.body.appendChild(container);

    await waitForPrintResources(container, iframeWindow);

    triggerPrint(iframeWindow, () => {
        cleanupPrintSandbox(iframe, null);
    });
}
