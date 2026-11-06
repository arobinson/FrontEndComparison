import { createMemo } from 'solid-js';
import './LargeCounter.css';

interface LargeCounterProps {
  value: number | undefined;
}

export default function LargeCounter(props: LargeCounterProps) {
  const formattedValue = createMemo(() => {
    const value = props.value;
    if (value === undefined || value === null) {
      return '0';
    }
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + 'M';
    }
    if (value >= 1_000) {
      return value.toLocaleString('en-US');
    }
    return value.toString();
  });

  return <span class="large-counter">{formattedValue()}</span>;
}
