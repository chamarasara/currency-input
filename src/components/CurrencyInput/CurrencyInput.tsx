// src/components/CurrencyInput/CurrencyInput.tsx
import React, { useEffect, useRef, useState } from 'react';
import { formatCurrency, parseCurrencyString, roundToTwo } from '../utils/format';

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number | null; // value in normal units (e.g., 1234.5)
  onChange: (value: number | null) => void;
  showSymbol?: string | false;
  live?: boolean; // whether to format while typing
  allowNegative?: boolean;
  min?: number;
  max?: number;
}

/**
 * Controlled CurrencyInput — displays thousands '.' and decimal ','.
 */
export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  id,
  name,
  showSymbol = false,
  live = false,
  allowNegative = false,
  min,
  max,
  className,
  placeholder,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [internal, setInternal] = useState<string>('');

  // sync display when external value changes (but don't stomp while focused)
  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      // keep editing state while focused
      return;
    }
    setInternal(formatCurrency(value ?? null, showSymbol));
  }, [value, showSymbol]);

  // helper to set caret
  function setCaret(pos: number) {
    const el = inputRef.current;
    if (!el) return;
    window.requestAnimationFrame(() => {
      el.setSelectionRange(pos, pos);
    });
  }

  // insert text at caret position
  function insertAtCaret(text: string) {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;
    const next = el.value.slice(0, start) + text + el.value.slice(end);
    setInternal(next);
    // attempt to move caret after inserted text
    setTimeout(() => setCaret(start + text.length), 0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // ensure NumpadDecimal becomes ',' (decimal separator)
    if (e.code === 'NumpadDecimal') {
      e.preventDefault();
      // insert comma if not present
      const current = inputRef.current?.value ?? '';
      if (!current.includes(',')) {
        insertAtCaret(',');
      } else {
        // already has decimal separator -> put caret after it
        const el = inputRef.current!;
        const idx = current.indexOf(',');
        setCaret(idx + 1);
      }
    }
    // allow navigation/backspace/delete/arrow keys untouched
    // other keys are handled by onChange sanitization
  }

  function enforceBounds(n: number | null) {
    if (n === null) return null;
    if (typeof min === 'number' && n < min) return min;
    if (typeof max === 'number' && n > max) return max;
    return n;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setInternal(raw);

    // parse to numeric where possible
    const parsed = parseCurrencyString(raw);
    const bounded = enforceBounds(parsed);
    onChange(bounded);
    // if live formatting requested, update internal with formatted version
    if (live && typeof bounded === 'number') {
      const formatted = formatCurrency(bounded, showSymbol);
      setInternal(formatted);
      // caret might move; naive approach places caret at end
      setTimeout(() => {
        const el = inputRef.current;
        if (el) {
          const pos = el.value.length;
          el.setSelectionRange(pos, pos);
        }
      }, 0);
    }
  }

  function handleBlur() {
    // on blur we must ensure exactly 2 decimals
    const parsed = parseCurrencyString(internal);
    if (parsed === null) {
      setInternal('');
      onChange(null);
      return;
    }
    const rounded = roundToTwo(parsed);
    const bounded = enforceBounds(rounded);
    onChange(bounded);
    setInternal(formatCurrency(bounded ?? null, showSymbol));
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text');
    if (!text) return;
    e.preventDefault();
    // parse and set a formatted value
    const parsed = parseCurrencyString(text);
    if (parsed === null) {
      // if nothing parseable, ignore paste
      return;
    }
    const bounded = enforceBounds(roundToTwo(parsed));
    onChange(bounded);
    setInternal(formatCurrency(bounded ?? null, showSymbol));
    // put caret at end
    setTimeout(() => {
      const el = inputRef.current;
      if (el) {
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }, 0);
  }

  return (
    <input
      ref={inputRef}
      id={id}
      name={name}
      className={className}
      placeholder={placeholder}
      value={internal}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onPaste={handlePaste}
      inputMode="decimal"
      {...rest}
    />
  );
};

export default CurrencyInput;
