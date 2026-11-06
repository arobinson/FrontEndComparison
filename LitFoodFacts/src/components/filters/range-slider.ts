import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FilterStore, FilterStoreController, type RangeFilterValue } from './filter-store.js';

const parseInput = (e: Event): number | undefined => {
  const value = (e.target as HTMLInputElement).value;
  return value === '' ? undefined : Number(value);
};

// Only bounds that are set end up in the (applied) range object.
const toRange = (min: number | undefined, max: number | undefined): RangeFilterValue => {
  const result: RangeFilterValue = {};
  if (min !== undefined) result.min = min;
  if (max !== undefined) result.max = max;
  return result;
};

@customElement('range-slider')
export class RangeSlider extends LitElement {
  static styles = css`
    /* The app's global reset (styles.css) does not reach into shadow roots. */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :host {
      display: block;
    }

    .range-slider {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .range-input {
      width: 60px;
      padding: 4px 6px;
      border: 1px solid var(--color-border, #ddd);
      border-radius: 4px;
      font-size: 13px;
      font-family: inherit;
    }

    .range-input:focus {
      outline: none;
      border-color: var(--color-primary, #0066cc);
    }

    .range-separator {
      color: var(--color-text-secondary, #999);
    }
  `;

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ attribute: false }) column = '';
  @property({ attribute: false }) store?: FilterStore;

  constructor() {
    super();
    new FilterStoreController(this, () => this.store);
  }

  private get draft(): RangeFilterValue | undefined {
    return this.store?.getDraft<RangeFilterValue>(this.column);
  }

  private handleMinChange(e: Event) {
    this.store?.setDraft(this.column, toRange(parseInput(e), this.draft?.max));
  }

  private handleMaxChange(e: Event) {
    this.store?.setDraft(this.column, toRange(this.draft?.min, parseInput(e)));
  }

  // Applies on blur of either input.
  private handleBlur() {
    this.store?.apply(this.column);
  }

  render() {
    const draft = this.draft;
    return html`
      <div class="range-slider">
        <input
          type="number"
          class="range-input"
          min=${this.min}
          max=${this.max}
          .value=${String(draft?.min ?? '')}
          @input=${this.handleMinChange}
          @blur=${this.handleBlur}
          placeholder="Min"
        />
        <span class="range-separator">-</span>
        <input
          type="number"
          class="range-input"
          min=${this.min}
          max=${this.max}
          .value=${String(draft?.max ?? '')}
          @input=${this.handleMaxChange}
          @blur=${this.handleBlur}
          placeholder="Max"
        />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'range-slider': RangeSlider;
  }
}
