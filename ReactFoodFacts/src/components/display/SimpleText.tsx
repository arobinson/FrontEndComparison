import { memo } from 'react';

interface SimpleTextProps {
  value: string | null | undefined;
  className?: string;
}

export const SimpleText = memo(({ value, className = '' }: SimpleTextProps) => {
  return (
    <span className={`simple-text ${className}`}>
      {value ?? '—'}
    </span>
  );
});

SimpleText.displayName = 'SimpleText';
