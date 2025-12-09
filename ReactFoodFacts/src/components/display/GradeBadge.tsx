import { memo, useMemo } from 'react';
import './GradeBadge.css';

interface GradeBadgeProps {
  grade: string | null | undefined;
}

export const GradeBadge = memo(({ grade }: GradeBadgeProps) => {
  const gradeClass = useMemo(() => {
    const gradeUpper = grade?.toUpperCase();
    let result: string;
    if (gradeUpper === 'A') {
      result = 'grade-a';
    } else if (gradeUpper === 'B') {
      result = 'grade-b';
    } else if (gradeUpper === 'C') {
      result = 'grade-c';
    } else if (gradeUpper === 'D') {
      result = 'grade-d';
    } else if (gradeUpper === 'F') {
      result = 'grade-f';
    } else {
      result = 'grade-unknown';
    }
    return result;
  }, [grade]);

  return (
    <span className={`grade-badge ${gradeClass}`}>
      {` ${grade} `}
    </span>
  );
});

GradeBadge.displayName = 'GradeBadge';
