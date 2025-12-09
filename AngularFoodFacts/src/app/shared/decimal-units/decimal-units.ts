import { Component, input, computed } from '@angular/core';

// Regex to extract currency symbol and numeric value
const CURRENCY_REGEX = /^([£$€¥₹])?([0-9,.-]+)([£$€¥₹])?$/;
const SYMBOL_TO_CURRENCY: Record<string, string> = {
  $: 'USD',
  '£': 'GBP',
  '€': 'EUR',
  '¥': 'JPY',
  '₹': 'INR',
};

@Component({
  selector: 'aff-decimal-units',
  imports: [],
  templateUrl: './decimal-units.html',
  styleUrl: './decimal-units.css',
})
export class DecimalUnits {
  readonly value = input.required<string | number | null | undefined>();
  readonly unit = input<string>('');
  readonly decimals = input<number>(2);
  readonly currencyCode = input<string | undefined>(undefined);

  readonly formattedValue = computed(() => {
    const val = this.value();
    const explicitCurrency = this.currencyCode();

    if (val === null || val === undefined || val === '') {
      return '';
    }

    let num: number;
    let detectedCurrency: string | undefined;

    if (typeof val === 'number') {
      num = val;
    } else {
      const match = val.trim().match(CURRENCY_REGEX);
      if (match) {
        const symbol = match[1] || match[3];
        if (symbol) {
          detectedCurrency = SYMBOL_TO_CURRENCY[symbol];
        }
        const cleaned = match[2].replace(/,/g, '');
        num = parseFloat(cleaned);
      } else {
        const cleaned = val.replace(/[^0-9.-]/g, '');
        num = parseFloat(cleaned);
      }
    }

    if (isNaN(num)) {
      return '';
    }

    const currency = explicitCurrency || detectedCurrency;
    if (currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: this.decimals(),
        maximumFractionDigits: this.decimals(),
      }).format(num);
    }

    return num.toFixed(this.decimals());
  });
}
