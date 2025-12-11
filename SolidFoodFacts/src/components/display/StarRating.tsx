import { createMemo, For } from 'solid-js';
import './StarRating.css';

interface StarRatingProps {
  value: number;
  maxStars?: number;
}

export default function StarRating(props: StarRatingProps) {
  const maxStars = () => props.maxStars ?? 5;

  const stars = createMemo(() => {
    const rating = Number(props.value) || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars() - fullStars - (hasHalfStar ? 1 : 0);

    return {
      full: Array(fullStars).fill(0),
      half: hasHalfStar ? [0] : [],
      empty: Array(Math.max(0, emptyStars)).fill(0),
    };
  });

  return (
    <div class="star-rating">
      <For each={stars().full}>
        {() => <span class="star full">★</span>}
      </For>
      <For each={stars().half}>
        {() => <span class="star half">★</span>}
      </For>
      <For each={stars().empty}>
        {() => <span class="star empty">☆</span>}
      </For>
      <span class="rating-value">{props.value}</span>
    </div>
  );
}
