import { useMemo, memo } from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
}

export const ProgressBar = memo(({ value }: ProgressBarProps) => {
  const percentage = useMemo(() => {
    let result: number;
    if (value < 0) {
      result = 0;
    } else if (value > 100) {
      result = 100;
    } else {
      result = value;
    }
    return result;
  }, [value]);

  const colorClass = useMemo(() => {
    let result: string;
    if (percentage >= 70) {
      result = 'high';
    } else if (percentage >= 40) {
      result = 'medium';
    } else {
      result = 'low';
    }
    return result;
  }, [percentage]);

  return (
    <div className="progress-bar-container">
      <div className={`progress-bar ${colorClass}`}>
        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="progress-text">{percentage}%</span>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';
