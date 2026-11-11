import { useCallback } from 'preact/hooks';
import { memo } from '../../utils/memo';
import { Button } from '../controls/Button';
import './TruncatedText.css';

interface TruncatedTextProps {
  value: string | null | undefined;
  maxLength?: number;
  /** Controlled: the parent owns the expanded state */
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export const TruncatedText = memo(function TruncatedText({
  value,
  maxLength = 50,
  expanded,
  onExpandedChange,
}: TruncatedTextProps) {
  const toggleExpanded = useCallback(() => {
    onExpandedChange(!expanded);
  }, [expanded, onExpandedChange]);

  const shouldTruncate = value ? value.length > maxLength : false;

  let displayValue: string;
  if (!value) {
    displayValue = '';
  } else if (shouldTruncate && !expanded) {
    displayValue = value.substring(0, maxLength - 3) + '...';
  } else {
    displayValue = value;
  }

  return (
    <div className="truncated-text">
      <span className="text-content">{displayValue}</span>
      {shouldTruncate && (
        <Button variant="tertiary" size="sm" className="toggle-button" onClick={toggleExpanded}>
          {expanded ? 'Show less' : 'Show more'}
        </Button>
      )}
    </div>
  );
});
