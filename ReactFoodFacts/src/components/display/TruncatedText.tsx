import { memo, useState, useCallback } from 'react';

interface TruncatedTextProps {
  value: string | null | undefined;
  maxLength?: number;
}

/**
 * TruncatedText - Long text with truncation + expand/collapse
 */
export const TruncatedText = memo(({ value, maxLength = 100 }: TruncatedTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  let displayValue;
  let showToggle;

  if (!value) {
    displayValue = '—';
    showToggle = false;
  } else if (value.length <= maxLength) {
    displayValue = value;
    showToggle = false;
  } else if (isExpanded) {
    displayValue = value;
    showToggle = true;
  } else {
    displayValue = value.substring(0, maxLength) + '...';
    showToggle = true;
  }

  return (
    <div className="truncated-text">
      <span>{displayValue}</span>
      {showToggle && (
        <button onClick={toggleExpanded} className="truncated-text-toggle" type="button">
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
});

TruncatedText.displayName = 'TruncatedText';
