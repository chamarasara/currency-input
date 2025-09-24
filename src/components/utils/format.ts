// src/utils/format.ts
export function formatCurrency(value: number | null, showSymbol?: string | false): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '';
  // Use de-DE locale to get '.' thousands and ',' decimal by default
  const nf = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatted = nf.format(value);
  if (showSymbol) {
    // simple suffix style; could be improved for flexible locale placement
    return `${formatted} ${showSymbol}`;
  }
  return formatted;
}

/**
 * parseCurrencyString
 *
 * - Accepts pasted strings like "€1,234.5", "1.234,5", "1234,5", "1234.5"
 * - Strategy:
 *   * If both '.' and ',' present: treat '.' as thousands and ',' as decimal -> remove dots, replace comma with dot (JS decimal)
 *   * If only ',' present: replace ',' with '.' and parse
 *   * If only '.' present:
 *       - If there are multiple '.' characters -> remove them (treat as thousands)
 *       - If single '.' and it has 0-2 chars after it -> treat as decimal
 *       - else treat '.' as thousands
 *   * Otherwise parse as integer
 * - Returns null if cannot parse
 */
export function parseCurrencyString(input: string): number | null {
  if (!input) return null;
  let s = input.trim();
  // remove currency symbols and whitespace
  s = s.replace(/[^\d.,-]/g, '');

  if (!s || s === '-' || s === ',' || s === '.') return null;

  const dotCount = (s.match(/\./g) || []).length;
  const commaCount = (s.match(/,/g) || []).length;

  if (dotCount > 0 && commaCount > 0) {
    // prefer comma as decimal, dot as thousand
    const cleaned = s.replace(/\./g, '').replace(',', '.');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : null;
  }

  if (commaCount > 0) {
    // treat comma as decimal separator
    const cleaned = s.replace(/\./g, '').replace(',', '.');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : null;
  }

  if (dotCount > 0) {
    if (dotCount > 1) {
      // multiple dots -> probably thousands separators
      const cleaned = s.replace(/\./g, '');
      const n = parseFloat(cleaned);
      return Number.isFinite(n) ? n : null;
    } else {
      // single dot: ambiguous
      const idx = s.indexOf('.');
      const fractionLen = s.length - idx - 1;
      if (fractionLen <= 2) {
        // likely decimal
        const n = parseFloat(s);
        return Number.isFinite(n) ? n : null;
      } else {
        // treat as thousand separator
        const cleaned = s.replace(/\./g, '');
        const n = parseFloat(cleaned);
        return Number.isFinite(n) ? n : null;
      }
    }
  }

  // only digits or '-' left
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

/** round to 2 decimals (banker's rounding not used; uses standard JS rounding) */
export function roundToTwo(v: number): number {
  return Math.round(v * 100) / 100;
}
