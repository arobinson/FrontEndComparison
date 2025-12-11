import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('relative-date')
export class RelativeDate extends LitElement {
  static styles = css`
    .relative-date {
      color: #333;
    }
  `;

  @property({ type: String })
  value = '';

  private get relativeTime(): string {
    if (!this.value) {
      return '';
    }
    const date = new Date(this.value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'just now';
    }
    if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  render() {
    return html`<span class="relative-date">${this.relativeTime}</span>`;
  }
}
