import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('text-search')
export class TextSearch extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .text-search {
      width: 100%;
      padding: 0.25rem 0.375rem;
      font-size: 0.8125rem;
      font-family: inherit;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }

    .text-search:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
    }

    .text-search::placeholder {
      color: #999;
    }
  `;

  @property({ type: String }) placeholder = 'Search';
  @property({ type: Number }) resetTrigger = 0;

  @state() private inputValue = '';

  private lastResetTrigger = 0;

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('resetTrigger') && this.resetTrigger !== this.lastResetTrigger) {
      this.lastResetTrigger = this.resetTrigger;
      if (this.resetTrigger > 0) {
        this.inputValue = '';
      }
    }
  }

  private handleInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.inputValue = value;
    this.dispatchEvent(new CustomEvent('value-change', { detail: value }));
  }

  render() {
    return html`
      <input
        type="text"
        class="text-search"
        placeholder=${this.placeholder}
        .value=${this.inputValue}
        @input=${this.handleInput}
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'text-search': TextSearch;
  }
}
