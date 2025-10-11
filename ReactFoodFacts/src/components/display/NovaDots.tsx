import { memo, useMemo } from 'react';

interface NovaDotsProps {
  rating: number | null | undefined;
}

export const NovaDots = memo(({ rating }: NovaDotsProps) => {
  const dots = useMemo(() => {
    const validRating = rating && rating >= 1 && rating <= 4 ? rating : 0;
    const result = [];

    for (let i = 1; i <= 4; i++) {
      const dotClass = i <= validRating ? 'nova-dot filled' : 'nova-dot empty';
      result.push(
        <span key={i} className={dotClass}>
          ●
        </span>
      );
    }

    return result;
  }, [rating]);

  return <div className="nova-dots">{dots}</div>;
});

NovaDots.displayName = 'NovaDots';
