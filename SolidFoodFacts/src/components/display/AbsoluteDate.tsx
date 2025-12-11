import { createMemo } from 'solid-js';
import './AbsoluteDate.css';

interface AbsoluteDateProps {
  value: string;
}

export default function AbsoluteDate(props: AbsoluteDateProps) {
  const formattedDate = createMemo(() => {
    if (!props.value) {
      return '';
    }
    const date = new Date(props.value);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });

  return <span class="absolute-date">{formattedDate()}</span>;
}
