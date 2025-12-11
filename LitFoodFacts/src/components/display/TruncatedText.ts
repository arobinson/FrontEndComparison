import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('truncated-text')
export class TruncatedText extends LitElement {
  static styles = css`
    .truncated-text {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .text-content {
      flex: 1;
      word-break: break-word;
    }

    .toggle-button {
      background: none;
      border: none;
      color: #0066cc;
      cursor: pointer;
      font-size: 12px;
      padding: 2px 6px;
      text-decoration: underline;
      white-space: nowrap;
    }

    .toggle-button:hover {
      color: #004499;
    }

    .toggle-button:focus {
      outline: 2px solid #0066cc;
      outline-offset: 2px;
    }
  `;

  @property({ type: String })
  value = '';

  @property({ type: Number })
  maxLength = 50;

  @state()
  private isExpanded = false;

  private get shouldTruncate(): boolean {
    return (this.value?.length ?? 0) > this.maxLength;
  }

  private get displayText(): string {
    const text = this.value || '';
    if (this.shouldTruncate && !this.isExpanded) {
      return text.substring(0, this.maxLength - 3) + '...';
    }
    return text;
  }

  private toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  render() {
    return html`
      <div class="truncated-text">
        <span class="text-content">${this.displayText}</span>
        ${this.shouldTruncate
          ? html`
              <button
                class="toggle-button"
                @click="${this.toggleExpanded}"
                type="button"
              >
                ${this.isExpanded ? 'Show less' : 'Show more'}
              </button>
            `
          : ''}
      </div>
    `;
  }
}
