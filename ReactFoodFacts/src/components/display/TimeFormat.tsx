import { memo, useMemo } from 'react';

interface TimeFormatProps {
  value: string | null | undefined;
}

export const TimeFormat = memo(({ value }: TimeFormatProps) => {
  const formatted = useMemo(() => {
    let result;
    if (!value) {
      result = '—';
    } else {
      const timeMatch = value.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
      if (!timeMatch) {
        result = '—';
      } else {
        const hours = parseInt(timeMatch[1], 10);
        const minutes = timeMatch[2];
        const date = new Date();
        date.setHours(hours, parseInt(minutes, 10), 0, 0);

        result = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }).format(date);
      }
    }
    return result;
  }, [value]);

  return <span className="time-format">{formatted}</span>;
});

TimeFormat.displayName = 'TimeFormat';
