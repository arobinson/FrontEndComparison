import { createMemo } from 'solid-js';
import './GradeBadge.css';

interface GradeBadgeProps {
  value: string | null | undefined;
}

export default function GradeBadge(props: GradeBadgeProps) {
  const gradeClass = createMemo(() => {
    switch (props.value?.toUpperCase()) {
      case 'A':
        return 'grade-a';
      case 'B':
        return 'grade-b';
      case 'C':
        return 'grade-c';
      case 'D':
        return 'grade-d';
      case 'F':
        return 'grade-f';
      default:
        return 'grade-unknown';
    }
  });

  return <span class={`grade-badge ${gradeClass()}`}>{props.value}</span>;
}
