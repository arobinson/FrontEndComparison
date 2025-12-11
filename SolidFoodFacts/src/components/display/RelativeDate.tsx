import { createMemo } from 'solid-js';
import './RelativeDate.css';

interface RelativeDateProps {
  value: string;
}

export default function RelativeDate(props: RelativeDateProps) {
  const relativeTime = createMemo(() => {
    if (!props.value) {
      return '';
    }
    const date = new Date(props.value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'just now';
    }
    if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  });

  return <span class="relative-date">{relativeTime()}</span>;
}
