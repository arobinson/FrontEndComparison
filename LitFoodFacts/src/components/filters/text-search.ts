import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FilterStore, FilterStoreController } from './filter-store.js';

@customElement('text-search')
export class TextSearch extends LitElement {
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

    .text-search-input {
      width: 100%;
      padding: 0.25rem 0.375rem;
      border: 1px solid var(--color-border, #ddd);
      border-radius: 4px;
      font-size: 0.8125rem;
      font-family: inherit;
      box-sizing: border-box;
    }

    .text-search-input:focus {
      outline: none;
      border-color: var(--color-primary, #0066cc);
      box-shadow: 0 0 0 2px var(--color-primary-light, rgba(0, 102, 204, 0.1));
    }

    .text-search-input::placeholder {
      color: var(--color-text-secondary, #999);
    }
  `;

  @property({ type: String }) placeholder = 'Search';
  @property({ attribute: false }) column = '';
  @property({ attribute: false }) store?: FilterStore;

  constructor() {
    super();
    new FilterStoreController(this, () => this.store);
  }

  private handleInput(e: Event) {
    this.store?.setDraft(this.column, (e.target as HTMLInputElement).value);
  }

  // Applies on blur and on Enter.
  private handleBlur() {
    this.store?.apply(this.column);
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.store?.apply(this.column);
    }
  }

  render() {
    return html`
      <input
        type="text"
        class="text-search-input"
        placeholder=${this.placeholder}
        .value=${this.store?.getDraft<string>(this.column) ?? ''}
        @input=${this.handleInput}
        @blur=${this.handleBlur}
        @keyup=${this.handleKeyUp}
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'text-search': TextSearch;
  }
}
