import { memo } from 'react';

interface BooleanYesNoProps {
  value: boolean | null | undefined;
}

export const BooleanYesNo = memo(({ value }: BooleanYesNoProps) => {
  let displayValue;
  let className;

  if (value === true) {
    displayValue = 'Yes';
    className = 'boolean-yes';
  } else if (value === false) {
    displayValue = 'No';
    className = 'boolean-no';
  } else {
    displayValue = '—';
    className = 'boolean-unknown';
  }

  return <span className={`boolean-yesno ${className}`}>{displayValue}</span>;
});

BooleanYesNo.displayName = 'BooleanYesNo';
