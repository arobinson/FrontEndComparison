import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../controls/lit-button.js';

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

  @property()
  value = '';

  @property({ type: Number })
  maxLength = 50;

  /** Controlled: the parent owns the expanded state and listens for `expanded-change` */
  @property({ type: Boolean })
  expanded = false;

  private get shouldTruncate(): boolean {
    return (this.value?.length ?? 0) > this.maxLength;
  }

  private get displayText(): string {
    const text = this.value || '';
    if (this.shouldTruncate && !this.expanded) {
      return text.substring(0, this.maxLength - 3) + '...';
    }
    return text;
  }

  private toggleExpanded() {
    this.dispatchEvent(new CustomEvent('expanded-change', { detail: !this.expanded, bubbles: true }));
  }

  render() {
    return html`
      <div class="truncated-text">
        <span class="text-content">${this.displayText}</span>
        ${this.shouldTruncate
          ? html`
              <lit-button variant="tertiary" size="sm" extra-class="toggle-button" @button-click=${this.toggleExpanded}>${this.expanded ? 'Show less' : 'Show more'}</lit-button>
            `
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'truncated-text': TruncatedText;
  }
}
