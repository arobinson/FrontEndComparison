import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../shared/lit-button.js';

const NO_SELECTION: string[] = [];
let nextId = 0;

/**
 * Controlled checkbox dropdown. Shows `value` (the selected options); fires `value-change`
 * (detail: the new selection, in insertion order) on every toggle.
 *
 * The dropdown is a native popover: the toggle button opens and closes it, and the browser
 * closes it on an outside click or Escape. The options only render while it is open.
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

    .arrow {
      font-size: 10px;
      color: var(--color-text-secondary, #999);
    }

    /* A popover (top layer, light dismiss), placed under the toggle that opens it: the toggle is
       the popover's implicit anchor. */
    .dropdown {
      inset: auto;
      position-area: bottom span-right;
      width: anchor-size(width);
      margin: 2px 0 0;
      padding: 0;
      max-height: 200px;
      overflow-y: auto;
      color: inherit;
      background: white;
      border: 1px solid var(--color-border, #ddd);
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  private readonly dropdownId = `multi-select-${nextId++}`;

  private onBeforeToggle(event: ToggleEvent) {
    this.isOpen = event.newState === 'open';
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
        <lit-button size="sm" extra-class="select-toggle" popovertarget=${this.dropdownId}><span>${this.displayText(selected)}</span><span class="arrow">▼</span></lit-button>

        <div id=${this.dropdownId} class="dropdown" popover="auto" @beforetoggle=${this.onBeforeToggle}>
          ${this.isOpen
            ? this.options.map(
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
              )
            : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'multi-select': MultiSelect;
  }
}
