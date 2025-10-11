import { memo, useMemo } from 'react';

interface StarRatingProps {
  rating: number | null | undefined;
  maxStars?: number;
}

export const StarRating = memo(({ rating, maxStars = 5 }: StarRatingProps) => {
  const stars = useMemo(() => {
    const validRating = rating && rating >= 0 && rating <= maxStars ? rating : 0;
    const fullStars = Math.floor(validRating);
    const hasHalfStar = validRating % 1 >= 0.5;
    const result = [];

    for (let i = 1; i <= maxStars; i++) {
      let star;
      if (i <= fullStars) {
        star = '★';
      } else if (i === fullStars + 1 && hasHalfStar) {
        star = '⯨';
      } else {
        star = '☆';
      }

      result.push(
        <span key={i} className="star">
          {star}
        </span>
      );
    }

    return result;
  }, [rating, maxStars]);

  return <div className="star-rating">{stars}</div>;
});

StarRating.displayName = 'StarRating';
