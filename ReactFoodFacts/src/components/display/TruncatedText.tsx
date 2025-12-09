import { memo, useState, useCallback } from 'react';
import './TruncatedText.css';

interface TruncatedTextProps {
  value: string | null | undefined;
  maxLength?: number;
}

export const TruncatedText = memo(({ value, maxLength = 50 }: TruncatedTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const shouldTruncate = value ? value.length > maxLength : false;

  let displayValue: string;
  if (!value) {
    displayValue = '';
  } else if (shouldTruncate && !isExpanded) {
    displayValue = value.substring(0, maxLength - 3) + '...';
  } else {
    displayValue = value;
  }

  return (
    <div className="truncated-text">
      <span className="text-content">{displayValue}</span>
      {shouldTruncate && (
        <button onClick={toggleExpanded} className="toggle-button" type="button">
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
});

TruncatedText.displayName = 'TruncatedText';
