import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('multi-select')
export class MultiSelect extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    .select-button {
      width: 100%;
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      font-size: 13px;
      text-align: left;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
    }

    .select-button:hover {
      border-color: #0066cc;
    }

    .arrow {
      font-size: 10px;
      color: #999;
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
      border: 1px solid #ddd;
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
      background-color: #f5f5f5;
    }

    .option input[type="checkbox"] {
      cursor: pointer;
    }
  `;

  @property({ type: Array }) options: string[] = [];
  @property({ type: Number }) resetTrigger = 0;

  @state() private selected = new Set<string>();
  @state() private isOpen = false;

  private lastResetTrigger = 0;

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('resetTrigger') && this.resetTrigger !== this.lastResetTrigger) {
      this.lastResetTrigger = this.resetTrigger;
      if (this.resetTrigger > 0) {
        this.selected = new Set();
      }
    }
  }

  private toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  private toggleOption(option: string) {
    const newSelected = new Set(this.selected);
    if (newSelected.has(option)) {
      newSelected.delete(option);
    } else {
      newSelected.add(option);
    }
    this.selected = newSelected;
    this.dispatchEvent(new CustomEvent('value-change', { detail: [...newSelected] }));
  }

  private get displayText(): string {
    return this.selected.size === 0 ? 'All' : `${this.selected.size} selected`;
  }

  render() {
    return html`
      <button type="button" class="select-button" @click=${this.toggleDropdown}>
        ${this.displayText}
        <span class="arrow">${this.isOpen ? '▲' : '▼'}</span>
      </button>

      ${this.isOpen ? html`
        <div class="dropdown">
          ${this.options.map(option => html`
            <label class="option">
              <input
                type="checkbox"
                .checked=${this.selected.has(option)}
                @change=${() => this.toggleOption(option)}
              />
              ${option}
            </label>
          `)}
        </div>
      ` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'multi-select': MultiSelect;
  }
}
