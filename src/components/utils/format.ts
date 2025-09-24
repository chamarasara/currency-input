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

export function parseCurrencyString(input: string): number | null {
  if (!input) return null;
  let s = input.trim();
  s = s.replace(/[^\d.,-]/g, '');

  if (!s || s === '-' || s === ',' || s === '.') return null;

  const dotCount = (s.match(/\./g) || []).length;
  const commaCount = (s.match(/,/g) || []).length;

  if (dotCount > 0 && commaCount > 0) {
    const cleaned = s.replace(/\./g, '').replace(',', '.');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : null;
  }

  if (commaCount > 0) {
    const cleaned = s.replace(/\./g, '').replace(',', '.');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : null;
  }

  if (dotCount > 0) {
    if (dotCount > 1) {
      const cleaned = s.replace(/\./g, '');
      const n = parseFloat(cleaned);
      return Number.isFinite(n) ? n : null;
    } else {
      const idx = s.indexOf('.');
      const fractionLen = s.length - idx - 1;
      if (fractionLen <= 2) {
        const n = parseFloat(s);
        return Number.isFinite(n) ? n : null;
      } else {
        const cleaned = s.replace(/\./g, '');
        const n = parseFloat(cleaned);
        return Number.isFinite(n) ? n : null;
      }
    }
  }

  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

export function roundToTwo(v: number): number {
  return Math.round(v * 100) / 100;
}
