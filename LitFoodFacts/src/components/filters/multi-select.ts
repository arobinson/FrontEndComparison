import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../shared/lit-button.js';

const NO_SELECTION: string[] = [];

/**
 * Controlled checkbox dropdown. Shows `value` (the selected options); fires `value-change`
 * (detail: the new selection, in insertion order) on every toggle.
 */
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
  @property({ attribute: false }) value: string[] = NO_SELECTION;
  @property({ type: String }) placeholder = 'Select...';

  @state() private isOpen = false;

  connectedCallback() {
    super.connectedCallback();
    // Side effect: document-level click listener (click outside closes the dropdown).
    document.addEventListener('click', this.handleClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleClickOutside);
  }

  // composedPath() crosses shadow roots, so a click on the lit-button toggle's inner <button>
  // still includes this element and counts as inside.
  private handleClickOutside = (e: MouseEvent) => {
    if (this.isOpen && !e.composedPath().includes(this)) {
      this.isOpen = false;
    }
  };

  private toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  private toggleOption(option: string) {
    const selected = this.value;
    const next = selected.includes(option) ? selected.filter((v) => v !== option) : [...selected, option];
    this.dispatchEvent(new CustomEvent<string[]>('value-change', { detail: next }));
  }

  private displayText(selected: string[]): string {
    if (selected.length === 0) return this.placeholder;
    if (selected.length === 1) return selected[0];
    return `${selected.length} selected`;
  }

  render() {
    const selected = this.value;
    return html`
      <div class="multi-select">
        <lit-button size="sm" extra-class="select-toggle" @button-click=${this.toggleDropdown}><span>${this.displayText(selected)}</span><span class="arrow">▼</span></lit-button>

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
