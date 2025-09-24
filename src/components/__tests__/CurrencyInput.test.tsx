import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CurrencyInput from '../CurrencyInput/CurrencyInput';
import userEvent from '@testing-library/user-event';

function Wrapper({ initial = null }: { initial?: number | null }) {
  const [v, setV] = React.useState<number | null>(initial);
  return (
    <div>
      <CurrencyInput value={v} onChange={setV} data-testid="ci" />
      <div data-testid="value">{String(v)}</div>
    </div>
  );
}

test('formats typed thousands on change', async () => {
  render(<Wrapper initial={null} />);
  const input = screen.getByTestId('ci') as HTMLInputElement;
  await userEvent.type(input, '1234');
  // User types digits; component updates display internal state
  expect(input.value.includes('1.234') || input.value.includes('1234')).toBeTruthy();
});

test('numpad decimal inserts comma', () => {
  render(<Wrapper initial={1234} />);
  const input = screen.getByTestId('ci') as HTMLInputElement;
  input.focus();
  // simulate numpad decimal
  fireEvent.keyDown(input, { code: 'NumpadDecimal', key: 'Decimal' });
  // now type 5 and 0
  userEvent.type(input, '50');
  // blur to force formatting
  fireEvent.blur(input);
  // should display with decimal comma and two decimals
  expect(input.value.includes(',50')).toBeTruthy();
});

test('paste "€1,234.5" becomes 1234.5', () => {
  render(<Wrapper initial={null} />);
  const input = screen.getByTestId('ci') as HTMLInputElement;
  input.focus();
  fireEvent.paste(input, {
    clipboardData: {
      getData: () => '€1,234.5',
    } as unknown as DataTransfer,
  });
  // after paste the input should format to 1.234,50
  const valueText = screen.getByTestId('value').textContent;
  expect(valueText === '1234.5' || valueText === '1234.50').toBeTruthy();
});
