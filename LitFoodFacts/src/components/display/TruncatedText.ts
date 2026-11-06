import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../shared/lit-button.js';

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
              <lit-button variant="tertiary" size="sm" extra-class="toggle-button" @button-click=${this.toggleExpanded}>${this.isExpanded ? 'Show less' : 'Show more'}</lit-button>
            `
          : ''}
      </div>
    `;
  }
}
