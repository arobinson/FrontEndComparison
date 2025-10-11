import { memo, useMemo } from 'react';

interface DecimalUnitsProps {
  value: number | null | undefined;
  unit: string;
  decimals?: number;
}

export const DecimalUnits = memo(({ value, unit, decimals = 2 }: DecimalUnitsProps) => {
  const formatted = useMemo(() => {
    let result;
    if (value === null || value === undefined) {
      result = '—';
    } else {
      result = value.toFixed(decimals) + ' ' + unit;
    }
    return result;
  }, [value, unit, decimals]);

  return <span className="decimal-units">{formatted}</span>;
});

DecimalUnits.displayName = 'DecimalUnits';
