import { memo, useMemo } from 'react';
import './LargeCounter.css';

interface LargeCounterProps {
  value: number | null | undefined;
}

export const LargeCounter = memo(({ value }: LargeCounterProps) => {
  const formattedValue = useMemo(() => {
    let result: string;
    if (value === null || value === undefined) {
      result = '0';
    } else if (value >= 1000000) {
      result = (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      result = value.toLocaleString('en-US');
    } else {
      result = value.toString();
    }
    return result;
  }, [value]);

  return <span className="large-counter">{formattedValue}</span>;
});

LargeCounter.displayName = 'LargeCounter';
