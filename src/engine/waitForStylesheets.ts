// ----------------------------------------------------------------------------------------------------
// MARK: Functions
// ----------------------------------------------------------------------------------------------------
export async function waitForStylesheets(targetDocument: Document): Promise<void> {
    const links = Array.from(targetDocument.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));

    const loadPromises = links.map((link) => {
        if (link.sheet) {
            return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
            link.addEventListener('load', () => resolve(), { once: true });
            link.addEventListener('error', () => resolve(), { once: true });
        });
    });

    await Promise.all(loadPromises);
}
