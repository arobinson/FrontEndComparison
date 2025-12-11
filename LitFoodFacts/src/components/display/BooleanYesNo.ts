import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('boolean-yesno')
export class BooleanYesNo extends LitElement {
  static styles = css`
    .boolean-yesno {
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .yes {
      color: #4caf50;
      background-color: #e8f5e9;
    }

    .no {
      color: #666;
      background-color: #f5f5f5;
    }
  `;

  @property({ type: Boolean })
  value: boolean | null | undefined = false;

  render() {
    return this.value
      ? html`<span class="boolean-yesno yes">Yes</span>`
      : html`<span class="boolean-yesno no">No</span>`;
  }
}
