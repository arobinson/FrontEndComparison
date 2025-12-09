import { memo, useMemo } from 'react';

interface RelativeDateProps {
  value: string | null | undefined;
}

export const RelativeDate = memo(({ value }: RelativeDateProps) => {
  const relativeTime = useMemo(() => {
    let result: string;
    if (!value) {
      result = '';
    } else {
      const date = new Date(value);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) {
        result = 'just now';
      } else if (diffMins < 60) {
        result = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        result = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        result = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      }
    }
    return result;
  }, [value]);

  return <span className="relative-date">{relativeTime}</span>;
});

RelativeDate.displayName = 'RelativeDate';
