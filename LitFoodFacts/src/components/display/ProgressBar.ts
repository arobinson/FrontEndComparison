import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('progress-bar')
export class ProgressBar extends LitElement {
  static styles = css`
    .progress-bar-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .progress-bar {
      flex: 1;
      height: 20px;
      background-color: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      min-width: 60px;
    }

    .progress-fill {
      height: 100%;
      transition: width 0.3s ease, background-color 0.3s ease;
      border-radius: 10px;
    }

    .progress-bar.high .progress-fill {
      background-color: #4caf50;
    }

    .progress-bar.medium .progress-fill {
      background-color: #ff9800;
    }

    .progress-bar.low .progress-fill {
      background-color: #f44336;
    }

    .progress-text {
      font-size: 12px;
      font-weight: 500;
      min-width: 35px;
      text-align: right;
      color: #666;
    }
  `;

  @property({ type: Number })
  value = 0;

  private get percentage(): number {
    if (this.value < 0) return 0;
    if (this.value > 100) return 100;
    return this.value;
  }

  private get colorClass(): string {
    const pct = this.percentage;
    if (pct >= 70) return 'high';
    if (pct >= 40) return 'medium';
    return 'low';
  }

  render() {
    return html`
      <div class="progress-bar-container">
        <div class="progress-bar ${this.colorClass}">
          <div class="progress-fill" style="width: ${this.percentage}%"></div>
        </div>
        <span class="progress-text">${this.percentage}%</span>
      </div>
    `;
  }
}
