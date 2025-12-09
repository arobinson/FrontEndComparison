import { memo, useMemo } from 'react';
import './NovaDots.css';

interface NovaDotsProps {
  rating: number | null | undefined;
}

export const NovaDots = memo(({ rating }: NovaDotsProps) => {
  const dots = useMemo(() => {
    let filledCount: number;
    if (!rating || rating < 1) {
      filledCount = 1;
    } else if (rating > 4) {
      filledCount = 4;
    } else {
      filledCount = Math.floor(rating);
    }

    const result = [];
    for (let i = 1; i <= 4; i++) {
      result.push(
        <span key={i} className={`dot${i <= filledCount ? ' filled' : ''}`} />
      );
    }
    return result;
  }, [rating]);

  return <div className="nova-dots">{dots}</div>;
});

NovaDots.displayName = 'NovaDots';
