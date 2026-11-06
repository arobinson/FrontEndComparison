import { createMemo } from 'solid-js';
import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
}

export default function ProgressBar(props: ProgressBarProps) {
  const percentage = createMemo(() => {
    if (props.value < 0) return 0;
    if (props.value > 100) return 100;
    return props.value;
  });

  const colorClass = createMemo(() => {
    const pct = percentage();
    if (pct >= 70) return 'high';
    if (pct >= 40) return 'medium';
    return 'low';
  });

  return (
    <div class="progress-bar-container">
      <div class={`progress-bar ${colorClass()}`}>
        <div class="progress-fill" style={{ width: `${percentage()}%` }}></div>
      </div>
      <span class="progress-text">{percentage()}%</span>
    </div>
  );
}
