import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Controlled text input. Shows `value`; fires `value-change` (detail: the new string)
 * on every input and `commit` on blur and on Enter.
 */
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

  @property({ attribute: false }) value = '';
  @property() placeholder = 'Search';

  private handleInput(e: Event) {
    this.dispatchEvent(new CustomEvent<string>('value-change', { detail: (e.target as HTMLInputElement).value }));
  }

  private commit() {
    this.dispatchEvent(new CustomEvent('commit'));
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.commit();
    }
  }

  render() {
    return html`
      <input
        type="text"
        class="text-search-input"
        placeholder=${this.placeholder}
        .value=${this.value}
        @input=${this.handleInput}
        @blur=${this.commit}
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
