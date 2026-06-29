import type { PrintOptions } from '../types/PrintOptions';

const defaultMarginMm = 14;

export function resolvePrintPageCss(options: PrintOptions): string {
    // ----------------------------------------------------------------------------------------------------
    // MARK: States & Constants
    // ----------------------------------------------------------------------------------------------------
    const paper = options.paper ?? 'A4';
    const orientation = options.orientation ?? 'portrait';
    const marginUnit = options.marginUnit ?? 'mm';
    const margin = options.margin ?? defaultMarginMm;

    // ----------------------------------------------------------------------------------------------------
    // MARK: Functions
    // ----------------------------------------------------------------------------------------------------
    return `
        @page {
            size: ${paper} ${orientation};
            margin: ${margin}${marginUnit};
        }

        html, body {
            margin: 0;
            padding: 0;
            background: #fff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .react-print-root {
            width: 100%;
        }

        @media print {
            .react-print-root,
            .react-print-root * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .react-print-root {
                max-width: none;
            }

            thead {
                display: table-header-group;
            }

            tr {
                break-inside: avoid;
            }
        }
    `;
}
