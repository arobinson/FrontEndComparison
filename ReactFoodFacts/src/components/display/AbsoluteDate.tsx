import { memo, useMemo } from 'react';

interface AbsoluteDateProps {
  value: string | null | undefined;
}

export const AbsoluteDate = memo(({ value }: AbsoluteDateProps) => {
  const formattedDate = useMemo(() => {
    let result: string;
    if (!value) {
      result = '';
    } else {
      const date = new Date(value);
      result = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return result;
  }, [value]);

  return <span className="absolute-date">{formattedDate}</span>;
});

AbsoluteDate.displayName = 'AbsoluteDate';
