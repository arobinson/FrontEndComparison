import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { FilterStore, FilterStoreController } from './filter-store.js';

const NO_SELECTION: string[] = [];

@customElement('multi-select')
export class MultiSelect extends LitElement {
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

    .multi-select {
      position: relative;
    }

    .select-toggle {
      width: 100%;
      padding: 4px 8px;
      border: 1px solid var(--color-border, #ddd);
      border-radius: 4px;
      background: white;
      font-size: 13px;
      text-align: left;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .select-toggle:hover {
      border-color: var(--color-primary, #0066cc);
    }

    .arrow {
      font-size: 10px;
      color: var(--color-text-secondary, #999);
    }

    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 2px;
      max-height: 200px;
      overflow-y: auto;
      background: white;
      border: 1px solid var(--color-border, #ddd);
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 100;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      cursor: pointer;
      font-size: 13px;
    }

    .option:hover {
      background-color: var(--color-bg-hover, #f5f5f5);
    }

    .option input[type="checkbox"] {
      cursor: pointer;
    }
  `;

  @property({ attribute: false }) options: string[] = [];
  @property({ type: String }) placeholder = 'Select...';
  @property({ attribute: false }) column = '';
  @property({ attribute: false }) store?: FilterStore;

  @state() private isOpen = false;

  constructor() {
    super();
    new FilterStoreController(this, () => this.store);
  }

  connectedCallback() {
    super.connectedCallback();
    // Side effect: document-level click listener (click outside closes the dropdown).
    document.addEventListener('click', this.handleClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleClickOutside);
  }

  private handleClickOutside = (e: MouseEvent) => {
    if (this.isOpen && !e.composedPath().includes(this)) {
      this.isOpen = false;
    }
  };

  private get selected(): string[] {
    return this.store?.getDraft<string[]>(this.column) ?? NO_SELECTION;
  }

  private toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  // Every toggle updates the selection and applies it immediately.
  private toggleOption(option: string) {
    const selected = this.selected;
    const next = selected.includes(option) ? selected.filter((v) => v !== option) : [...selected, option];
    this.store?.setDraft(this.column, next);
    this.store?.apply(this.column);
  }

  private displayText(selected: string[]): string {
    if (selected.length === 0) return this.placeholder;
    if (selected.length === 1) return selected[0];
    return `${selected.length} selected`;
  }

  render() {
    const selected = this.selected;
    return html`
      <div class="multi-select">
        <button class="select-toggle" @click=${this.toggleDropdown} type="button">
          <span>${this.displayText(selected)}</span>
          <span class="arrow">▼</span>
        </button>

        ${this.isOpen
          ? html`
              <div class="dropdown">
                ${this.options.map(
                  (option) => html`
                    <label class="option">
                      <input
                        type="checkbox"
                        .checked=${selected.includes(option)}
                        @change=${() => this.toggleOption(option)}
                      />
                      <span>${option}</span>
                    </label>
                  `
                )}
              </div>
            `
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'multi-select': MultiSelect;
  }
}
