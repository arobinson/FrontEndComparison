import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const CURRENCY_REGEX = /^([£$€¥₹])?([0-9,.-]+)([£$€¥₹])?$/;
const SYMBOL_TO_CURRENCY: Record<string, string> = {
  $: 'USD',
  '£': 'GBP',
  '€': 'EUR',
  '¥': 'JPY',
  '₹': 'INR',
};

@customElement('decimal-units')
export class DecimalUnits extends LitElement {
  static styles = css`
    .decimal-units {
      font-variant-numeric: tabular-nums;
    }

    .unit {
      margin-left: 0.25rem;
      color: #6b7280;
      font-size: 0.75rem;
    }
  `;

  @property({ type: String })
  value: string | number | null | undefined = '';

  @property({ type: String })
  unit = '';

  @property({ type: Number })
  decimals = 2;

  @property({ type: String })
  currencyCode = '';

  private get formattedValue(): string {
    const value = this.value;
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

    const currency = this.currencyCode || detectedCurrency;
    if (currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: this.decimals,
        maximumFractionDigits: this.decimals,
      }).format(num);
    }

    return num.toFixed(this.decimals);
  }

  render() {
    return html`
      <span class="decimal-units">
        ${this.formattedValue}
        ${this.unit ? html`<span class="unit">${this.unit}</span>` : ''}
      </span>
    `;
  }
}
