import React, { useState } from 'react';
import CurrencyInput from './components/CurrencyInput/CurrencyInput';
import './App.css';

function App() {
  const [value1, setValue1] = useState<number | null>(1234.5);
  const [value2, setValue2] = useState<number | null>(null);
  const [value3, setValue3] = useState<number | null>(-12.3);

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>CurrencyInput demo</h1>

      <div style={{ marginBottom: 20 }}>
        <label>Controlled (live formatting off, blur: 2 decimals)</label>
        <CurrencyInput
          value={value1}
          onChange={setValue1}
          placeholder="Type amount"
          showSymbol="€"
        />
        <div>value prop (raw number): {String(value1)}</div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Empty start (try paste: "€1,234.5" or type Numpad decimal)</label>
        <CurrencyInput
          value={value2}
          onChange={setValue2}
          placeholder="Paste or type"
          live={true}
        />
        <div>value prop: {String(value2)}</div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Negative allowed</label>
        <CurrencyInput
          value={value3}
          onChange={setValue3}
          allowNegative
          placeholder="negatives allowed"
        />
        <div>value prop: {String(value3)}</div>
      </div>
    </div>
  );
}

export default App;
