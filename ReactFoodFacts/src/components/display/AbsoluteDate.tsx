import { memo, useMemo } from 'react';

interface AbsoluteDateProps {
  value: string | null | undefined;
}

export const AbsoluteDate = memo(({ value }: AbsoluteDateProps) => {
  const formatted = useMemo(() => {
    let result;
    if (!value) {
      result = '—';
    } else {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        result = '—';
      } else {
        result = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(date);
      }
    }
    return result;
  }, [value]);

  return <span className="absolute-date">{formatted}</span>;
});

AbsoluteDate.displayName = 'AbsoluteDate';
