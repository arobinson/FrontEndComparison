import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/** A numeric range; a bound that is not set is absent. */
export type RangeValue = { min?: number; max?: number };

const NO_RANGE: RangeValue = {};

const parseInput = (e: Event): number | undefined => {
  const value = (e.target as HTMLInputElement).value;
  return value === '' ? undefined : Number(value);
};

// Only bounds that are set end up in the range object.
const toRange = (min: number | undefined, max: number | undefined): RangeValue => {
  const result: RangeValue = {};
  if (min !== undefined) result.min = min;
  if (max !== undefined) result.max = max;
  return result;
};

/**
 * Controlled pair of number inputs. Shows `value`; fires `value-change` (detail: the new
 * range) on every input and `commit` on blur of either input. `min`/`max` only bound the inputs.
 */
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

  @property({ attribute: false }) value: RangeValue = NO_RANGE;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;

  private emit(value: RangeValue) {
    this.dispatchEvent(new CustomEvent<RangeValue>('value-change', { detail: value }));
  }

  private handleMinChange(e: Event) {
    this.emit(toRange(parseInput(e), this.value.max));
  }

  private handleMaxChange(e: Event) {
    this.emit(toRange(this.value.min, parseInput(e)));
  }

  private commit() {
    this.dispatchEvent(new CustomEvent('commit'));
  }

  render() {
    const { min, max } = this.value;
    return html`
      <div class="range-slider">
        <input
          type="number"
          class="range-input"
          min=${this.min}
          max=${this.max}
          .value=${String(min ?? '')}
          @input=${this.handleMinChange}
          @blur=${this.commit}
          placeholder="Min"
        />
        <span class="range-separator">-</span>
        <input
          type="number"
          class="range-input"
          min=${this.min}
          max=${this.max}
          .value=${String(max ?? '')}
          @input=${this.handleMaxChange}
          @blur=${this.commit}
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
