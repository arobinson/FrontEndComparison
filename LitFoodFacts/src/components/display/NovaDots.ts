import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('nova-dots')
export class NovaDots extends LitElement {
  static styles = css`
    .nova-dots {
      display: inline-flex;
      gap: 4px;
      align-items: center;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid #0066cc;
      background-color: transparent;
      transition: background-color 0.2s ease;
    }

    .dot.filled {
      background-color: #0066cc;
    }

    .dot:hover {
      transform: scale(1.1);
    }
  `;

  @property({ type: Number })
  value = 1;

  private get rating(): number {
    if (this.value < 1) return 1;
    if (this.value > 4) return 4;
    return Math.floor(this.value);
  }

  private get dots(): Array<{ filled: boolean }> {
    const filledCount = this.rating;
    const result = [];
    for (let i = 1; i <= 4; i++) {
      result.push({ filled: i <= filledCount });
    }
    return result;
  }

  render() {
    return html`
      <div class="nova-dots">
        ${this.dots.map(
          (dot) => html`<span class="dot ${dot.filled ? 'filled' : ''}"></span>`
        )}
      </div>
    `;
  }
}
