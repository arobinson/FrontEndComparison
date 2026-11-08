import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
}

function clampPercentage(value: number) {
  let result: number;
  if (value < 0) {
    result = 0;
  } else if (value > 100) {
    result = 100;
  } else {
    result = value;
  }
  return result;
}

function colorClassFor(percentage: number) {
  let result: string;
  if (percentage >= 70) {
    result = 'high';
  } else if (percentage >= 40) {
    result = 'medium';
  } else {
    result = 'low';
  }
  return result;
}

export function ProgressBar({ value }: ProgressBarProps) {
  const percentage = clampPercentage(value);

  const colorClass = colorClassFor(percentage);

  return (
    <div className="progress-bar-container">
      <div className={`progress-bar ${colorClass}`}>
        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="progress-text">{percentage}%</span>
    </div>
  );
}
