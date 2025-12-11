import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('absolute-date')
export class AbsoluteDate extends LitElement {
  static styles = css`
    .absolute-date {
      color: #333;
    }
  `;

  @property({ type: String })
  value = '';

  private get formattedDate(): string {
    if (!this.value) {
      return '';
    }
    const date = new Date(this.value);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  render() {
    return html`<span class="absolute-date">${this.formattedDate}</span>`;
  }
}
