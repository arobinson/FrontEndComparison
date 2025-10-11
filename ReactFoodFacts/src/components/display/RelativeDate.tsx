import { memo, useState, useEffect, useMemo } from 'react';

interface RelativeDateProps {
  value: string | null | undefined;
}

export const RelativeDate = memo(({ value }: RelativeDateProps) => {
  const [_, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTrigger((prev) => prev + 1);
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatted = useMemo(() => {
    let result;
    if (!value) {
      result = '—';
    } else {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        result = '—';
      } else {
        const now = Date.now();
        const diff = now - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
          result = days === 1 ? '1 day ago' : `${days} days ago`;
        } else if (hours > 0) {
          result = hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (minutes > 0) {
          result = minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        } else {
          result = 'just now';
        }
      }
    }
    return result;
  }, [value]);

  return <span className="relative-date">{formatted}</span>;
});

RelativeDate.displayName = 'RelativeDate';
