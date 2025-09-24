# CurrencyInput (React + TypeScript)

This repo contains a reusable `CurrencyInput` React component that:
- Uses `.` as thousands separator and `,` as decimal separator.
- Always shows 2 decimals on blur (and when configured to do live formatting).
- Interprets the **numpad decimal key** as the decimal separator (`,`), regardless of keyboard layout.
- Is a **controlled component**: `value: number | null`, `onChange: (value) => void`.


## Setup

```bash
yarn install
yarn start
# run tests
yarn test
# build
yarn build
