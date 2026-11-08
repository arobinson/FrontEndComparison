import './NovaDots.css';

interface NovaDotsProps {
  rating: number | null | undefined;
}

function dotsFor(rating: number | null | undefined) {
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
}

export function NovaDots({ rating }: NovaDotsProps) {
  const dots = dotsFor(rating);

  return <div className="nova-dots">{dots}</div>;
}
