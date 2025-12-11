import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('time-format')
export class TimeFormat extends LitElement {
  static styles = css`
    .time-format {
      font-variant-numeric: tabular-nums;
    }
  `;

  @property({ type: String })
  value = '';

  private get formattedTime(): string {
    if (!this.value) {
      return '';
    }
    const [hours, minutes] = this.value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }

  render() {
    return html`<span class="time-format">${this.formattedTime}</span>`;
  }
}
