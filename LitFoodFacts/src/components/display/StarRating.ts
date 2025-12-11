import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('star-rating')
export class StarRating extends LitElement {
  static styles = css`
    .star-rating {
      display: flex;
      align-items: center;
      gap: 0.125rem;
    }

    .star {
      font-size: 1.25rem;
      line-height: 1;
    }

    .star.full {
      color: #ffc107;
    }

    .star.half {
      color: #ffc107;
      position: relative;
    }

    .star.half::after {
      content: "☆";
      position: absolute;
      left: 0;
      color: #e0e0e0;
      clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
    }

    .star.empty {
      color: #e0e0e0;
    }

    .rating-value {
      margin-left: 0.5rem;
      font-size: 0.875rem;
      color: #6c757d;
      font-weight: 500;
    }
  `;

  @property({ type: Number })
  value = 0;

  @property({ type: Number })
  maxStars = 5;

  private get stars(): {
    full: number[];
    half: number[];
    empty: number[];
  } {
    const rating = Number(this.value) || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = this.maxStars - fullStars - (hasHalfStar ? 1 : 0);

    return {
      full: Array(fullStars).fill(0),
      half: hasHalfStar ? [0] : [],
      empty: Array(Math.max(0, emptyStars)).fill(0),
    };
  }

  render() {
    const stars = this.stars;
    return html`
      <div class="star-rating">
        ${stars.full.map(() => html`<span class="star full">★</span>`)}
        ${stars.half.map(() => html`<span class="star half">★</span>`)}
        ${stars.empty.map(() => html`<span class="star empty">☆</span>`)}
        <span class="rating-value">${this.value}</span>
      </div>
    `;
  }
}
