import { cn } from '../utils/cn';

// ----------------------------------------------------------------------------------------------------
// MARK: Functions
// ----------------------------------------------------------------------------------------------------
export function syncThemeTokens(sourceDocument: Document, targetDocument: Document): void {
    const sourceStyles = getComputedStyle(sourceDocument.documentElement);
    const targetRoot = targetDocument.documentElement;

    for (const property of sourceStyles) {
        if (property.startsWith('--')) {
            targetRoot.style.setProperty(property, sourceStyles.getPropertyValue(property));
        }
    }

    const themeClasses = sourceDocument.documentElement.className
        .split(/\s+/)
        .filter((className) => className === 'dark' || className === 'light');

    targetRoot.className = cn(...themeClasses);
    targetDocument.body.className = 'bg-background text-foreground font-sans antialiased';
}
