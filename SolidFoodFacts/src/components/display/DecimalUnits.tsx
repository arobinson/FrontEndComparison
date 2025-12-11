import { createMemo, Show } from 'solid-js';
import './DecimalUnits.css';

const CURRENCY_REGEX = /^([£$€¥₹])?([0-9,.-]+)([£$€¥₹])?$/;
const SYMBOL_TO_CURRENCY: Record<string, string> = {
  $: 'USD',
  '£': 'GBP',
  '€': 'EUR',
  '¥': 'JPY',
  '₹': 'INR',
};

interface DecimalUnitsProps {
  value: string | number | null | undefined;
  unit?: string;
  decimals?: number;
  currencyCode?: string;
}

export default function DecimalUnits(props: DecimalUnitsProps) {
  const decimals = () => props.decimals ?? 2;

  const formattedValue = createMemo(() => {
    const value = props.value;
    if (value === null || value === undefined || value === '') {
      return '';
    }

    let num: number;
    let detectedCurrency: string | undefined;

    if (typeof value === 'number') {
      num = value;
    } else {
      const match = value.trim().match(CURRENCY_REGEX);
      if (match) {
        const symbol = match[1] || match[3];
        if (symbol) {
          detectedCurrency = SYMBOL_TO_CURRENCY[symbol];
        }
        const cleaned = match[2].replace(/,/g, '');
        num = parseFloat(cleaned);
      } else {
        const cleaned = value.replace(/[^0-9.-]/g, '');
        num = parseFloat(cleaned);
      }
    }

    if (isNaN(num)) {
      return '';
    }

    const currency = props.currencyCode || detectedCurrency;
    if (currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: decimals(),
        maximumFractionDigits: decimals(),
      }).format(num);
    }

    return num.toFixed(decimals());
  });

  return (
    <span class="decimal-units">
      {formattedValue()}
      <Show when={props.unit}>
        <span class="unit">{props.unit}</span>
      </Show>
    </span>
  );
}
