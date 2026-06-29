// ----------------------------------------------------------------------------------------------------
// MARK: Functions
// ----------------------------------------------------------------------------------------------------
function triggerPrintAndCleanup(printWindow: Window, onDone: () => void): void {
    let cleanedUp = false;

    function cleanup(): void {
        if (cleanedUp) {
            return;
        }

        cleanedUp = true;
        onDone();
    }

    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = cleanup;
    window.setTimeout(cleanup, 60_000);
}

export function triggerPrint(printWindow: Window, onDone: () => void): void {
    triggerPrintAndCleanup(printWindow, onDone);
}

async function waitForImages(container: HTMLElement): Promise<void> {
    const images = Array.from(container.querySelectorAll('img'));
    const loadPromises = images.map((image) => new Promise<void>((resolve) => {
        if (image.complete) {
            resolve();
            return;
        }

        image.addEventListener('load', () => resolve(), { once: true });
        image.addEventListener('error', () => resolve(), { once: true });
    }));

    await Promise.all(loadPromises);
}

async function waitForFonts(): Promise<void> {
    if ('fonts' in document) {
        await document.fonts.ready;
    }
}

export async function waitForNextPaint(printWindow: Window): Promise<void> {
    await new Promise<void>((resolve) => {
        printWindow.requestAnimationFrame(() => resolve());
    });
    await new Promise<void>((resolve) => {
        printWindow.requestAnimationFrame(() => resolve());
    });
    await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 150);
    });
}

export async function waitForPrintResources(container: HTMLElement, printWindow: Window): Promise<void> {
    await waitForImages(container);
    await waitForFonts();
    await waitForNextPaint(printWindow);
}
