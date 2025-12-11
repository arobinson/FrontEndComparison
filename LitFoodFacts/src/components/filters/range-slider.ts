import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('range-slider')
export class RangeSlider extends LitElement {
  static styles = css`
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
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      font-family: inherit;
      box-sizing: border-box;
    }

    .range-input:focus {
      outline: none;
      border-color: #0066cc;
    }

    .separator {
      color: #999;
    }
  `;

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) resetTrigger = 0;

  @state() private minValue = 0;
  @state() private maxValue = 100;

  private lastResetTrigger = 0;
  private initialized = false;

  updated(changedProperties: Map<string, unknown>) {
    // Initialize values on first render
    if (!this.initialized) {
      this.minValue = this.min;
      this.maxValue = this.max;
      this.initialized = true;
    }

    // Handle reset trigger
    if (changedProperties.has('resetTrigger') && this.resetTrigger !== this.lastResetTrigger) {
      this.lastResetTrigger = this.resetTrigger;
      if (this.resetTrigger > 0) {
        this.minValue = this.min;
        this.maxValue = this.max;
      }
    }
  }

  private handleMinChange(e: Event) {
    const target = e.target as HTMLInputElement;
    let newMin = Number(target.value);
    if (newMin > this.maxValue) newMin = this.maxValue;
    this.minValue = newMin;
    this.dispatchEvent(new CustomEvent('value-change', {
      detail: { min: this.minValue, max: this.maxValue }
    }));
  }

  private handleMaxChange(e: Event) {
    const target = e.target as HTMLInputElement;
    let newMax = Number(target.value);
    if (newMax < this.minValue) newMax = this.minValue;
    this.maxValue = newMax;
    this.dispatchEvent(new CustomEvent('value-change', {
      detail: { min: this.minValue, max: this.maxValue }
    }));
  }

  render() {
    return html`
      <div class="range-slider">
        <input
          type="number"
          class="range-input"
          .value=${String(this.minValue)}
          min=${this.min}
          max=${this.maxValue}
          @input=${this.handleMinChange}
        />
        <span class="separator">-</span>
        <input
          type="number"
          class="range-input"
          .value=${String(this.maxValue)}
          min=${this.minValue}
          max=${this.max}
          @input=${this.handleMaxChange}
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
