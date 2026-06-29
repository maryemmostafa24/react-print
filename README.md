# @mmmmzxe/react-print

[![npm version](https://img.shields.io/npm/v/@mmmmzxe/react-print.svg)](https://www.npmjs.com/package/@mmmmzxe/react-print)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Unified React print engine. Renders a declarative React component tree inside a hidden iframe, synchronizes active styles (Tailwind CSS, CSS modules, styled-components), and triggers the native print dialog.

## Install

```bash
npm install @mmmmzxe/react-print
```

**Peer dependencies:** `react` and `react-dom` (18+).

## Quick start

### Imperative print (recommended)

Pass print options directly when calling `print` — no provider or context required:

```tsx
import { usePrinter } from '@mmmmzxe/react-print';

const { print } = usePrinter();

await print({
  title: 'Commercial Offer',
  component: <MyDocument {...props} />,
  paper: 'A4',
  orientation: 'portrait',
  margin: 14,
});
```

### Declarative print

```tsx
import { Print } from '@mmmmzxe/react-print';

<Print
  options={{ paper: 'A4', margin: 10, orientation: 'portrait', title: 'Invoice #123' }}
  component={<Invoice data={invoice} />}
>
  {({ onPrint }) => (
    <button type="button" onClick={onPrint}>
      Print
    </button>
  )}
</Print>
```

### Ref-based print

Print existing DOM via a ref:

```tsx
import { useReactToPrint } from '@mmmmzxe/react-print';

const contentRef = useRef<HTMLDivElement>(null);
const { handlePrint } = useReactToPrint({
  contentRef,
  paper: 'A4',
  orientation: 'portrait',
});

<div ref={contentRef}>...</div>
<button type="button" onClick={() => void handlePrint()}>Print</button>
```

## i18n (`useI18n`)

Print renders in a sandboxed iframe, so React context (including i18n) is not inherited automatically. Wrap the print tree with your i18n provider:

```tsx
import { createContextPrintWrapper, usePrinter } from '@mmmmzxe/react-print';
import { I18nContext, useI18n } from '@/i18n';

function PrintInvoice() {
  const i18n = useI18n();
  const { print } = usePrinter({
    wrapper: createContextPrintWrapper(I18nContext, i18n),
  });

  return (
    <button
      type="button"
      onClick={() =>
        void print({
          title: i18n.t('invoice.title'),
          component: <Invoice />,
        })
      }
    >
      {i18n.t('actions.print')}
    </button>
  );
}
```

Inside `Invoice`, `const { t } = useI18n()` works because the iframe tree is wrapped with `I18nContext.Provider`.

You can also pass a custom wrapper per print call, or chain multiple providers with `chainPrintWrappers`.

## Tailwind CSS

The engine clones `<link rel="stylesheet">` and `<style>` tags from the host page into the print iframe and syncs `:root` theme tokens.

**Tailwind v4:** scan package utility classes in your app CSS:

```css
@import 'tailwindcss';
@source "../node_modules/@mmmmzxe/react-print/dist/**/*.js";
```

If you use `PrintSheet` / `PrintSection` helpers, include their classes in your Tailwind content/source paths.

## Next.js

Add the package to `transpilePackages` (usually not required when consuming built `dist`, but safe for linked workspaces):

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ['@mmmmzxe/react-print'],
};
```

## Layout helpers

```tsx
import { PrintSheet, PrintSection } from '@mmmmzxe/react-print';

<PrintSheet>
  <PrintSection className="p-4">...</PrintSection>
</PrintSheet>
```

## API

| Export | Description |
|--------|-------------|
| `Print` | Declarative wrapper with `options` + render-prop trigger |
| `usePrinter` | Imperative `print({ component, ...options })` |
| `useReactToPrint` | Print existing DOM via ref |
| `printReactTree` | Low-level engine entry |
| `PrintSheet` / `PrintSection` | Tailwind layout primitives |

## Development

```bash
git clone https://github.com/maryemmostafa24/react-print.git
cd react-print
npm install
npm run build
npm run typecheck
```

## Links

- [npm package](https://www.npmjs.com/package/@mmmmzxe/react-print)
- [GitHub repository](https://github.com/maryemmostafa24/react-print)
- [Report a security issue](SECURITY.md)

## License

MIT — see [LICENSE](LICENSE).
