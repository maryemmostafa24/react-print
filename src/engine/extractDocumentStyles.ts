import { syncThemeTokens } from './syncThemeTokens';
import { waitForStylesheets } from './waitForStylesheets';

// ----------------------------------------------------------------------------------------------------
// MARK: Functions
// ----------------------------------------------------------------------------------------------------
function appendStylesheetLink(sourceLink: HTMLLinkElement, targetDocument: Document): void {
    const link = targetDocument.createElement('link');
    link.rel = 'stylesheet';
    link.href = sourceLink.href;

    if (sourceLink.media) {
        link.media = sourceLink.media;
    }

    if (sourceLink.crossOrigin) {
        link.crossOrigin = sourceLink.crossOrigin;
    }

    targetDocument.head.appendChild(link);
}

export async function injectDocumentStyles(targetDocument: Document, extraStyles = ''): Promise<void> {
    const { head } = targetDocument;

    document.querySelectorAll('link[rel="stylesheet"]').forEach((node) => {
        if (node instanceof HTMLLinkElement && node.href) {
            appendStylesheetLink(node, targetDocument);
        }
    });

    document.querySelectorAll('style').forEach((style) => {
        head.appendChild(style.cloneNode(true));
    });

    if (extraStyles.trim().length > 0) {
        const styleElement = targetDocument.createElement('style');
        styleElement.setAttribute('data-react-print', 'page');
        styleElement.textContent = extraStyles;
        head.appendChild(styleElement);
    }

    syncThemeTokens(document, targetDocument);
    await waitForStylesheets(targetDocument);
}
