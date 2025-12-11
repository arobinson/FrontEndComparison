import { createMemo } from 'solid-js';
import './TimeFormat.css';

interface TimeFormatProps {
  value: string;
}

export default function TimeFormat(props: TimeFormatProps) {
  const formattedTime = createMemo(() => {
    if (!props.value) {
      return '';
    }
    const [hours, minutes] = props.value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  });

  return <span class="time-format">{formattedTime()}</span>;
}
