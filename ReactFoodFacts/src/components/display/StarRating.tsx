import './StarRating.css';

interface StarRatingProps {
  value: number | null | undefined;
  maxStars?: number;
}

function starsFor(value: number | null | undefined, maxStars: number) {
  const rating = value ?? 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return {
    full: Array(fullStars).fill(0),
    half: hasHalfStar ? [0] : [],
    empty: Array(emptyStars).fill(0),
  };
}

export function StarRating({ value, maxStars = 5 }: StarRatingProps) {
  const stars = starsFor(value, maxStars);

  return (
    <div className="star-rating">
      {stars.full.map((_, i) => (
        <span key={`full-${i}`} className="star full">★</span>
      ))}
      {stars.half.map((_, i) => (
        <span key={`half-${i}`} className="star half">★</span>
      ))}
      {stars.empty.map((_, i) => (
        <span key={`empty-${i}`} className="star empty">☆</span>
      ))}
      <span className="rating-value">{value}</span>
    </div>
  );
}
