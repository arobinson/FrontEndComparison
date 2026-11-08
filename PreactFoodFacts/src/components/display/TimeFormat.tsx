import { useMemo } from 'preact/hooks';
import { memo } from '../../utils/memo';

interface TimeFormatProps {
  value: string | null | undefined;
}

export const TimeFormat = memo(function TimeFormat({ value }: TimeFormatProps) {
  const formatted = useMemo(() => {
    let result: string;
    if (!value) {
      result = '';
    } else {
      const [hours, minutes] = value.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);

      result = new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    }
    return result;
  }, [value]);

  return <>{formatted}</>;
});
