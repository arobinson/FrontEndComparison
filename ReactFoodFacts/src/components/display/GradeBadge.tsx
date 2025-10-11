import { memo, useMemo } from 'react';

interface GradeBadgeProps {
  grade: string | null | undefined;
}

export const GradeBadge = memo(({ grade }: GradeBadgeProps) => {
  const badgeClass = useMemo(() => {
    let result;
    if (!grade) {
      result = 'grade-badge grade-unknown';
    } else {
      const gradeUpper = grade.toUpperCase();
      if (gradeUpper === 'A') {
        result = 'grade-badge grade-a';
      } else if (gradeUpper === 'B') {
        result = 'grade-badge grade-b';
      } else if (gradeUpper === 'C') {
        result = 'grade-badge grade-c';
      } else if (gradeUpper === 'D') {
        result = 'grade-badge grade-d';
      } else if (gradeUpper === 'F') {
        result = 'grade-badge grade-f';
      } else {
        result = 'grade-badge grade-unknown';
      }
    }
    return result;
  }, [grade]);

  return (
    <span className={badgeClass}>
      {grade?.toUpperCase() ?? '—'}
    </span>
  );
});

GradeBadge.displayName = 'GradeBadge';
