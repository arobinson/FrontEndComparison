import { useState } from 'react';
import { Button } from '../controls/Button';
import './TruncatedText.css';

interface TruncatedTextProps {
  value: string | null | undefined;
  maxLength?: number;
}

export function TruncatedText({ value, maxLength = 50 }: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

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
        <Button variant="tertiary" size="sm" className="toggle-button" onClick={toggleExpanded}>
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
      )}
    </div>
  );
}
