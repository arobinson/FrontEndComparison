import { memo } from 'react';
import './BooleanYesNo.css';

interface BooleanYesNoProps {
  value: boolean;
}

export const BooleanYesNo = memo(({ value }: BooleanYesNoProps) => {
  const displayText = value ? 'Yes' : 'No';
  const cssClass = value ? 'yes' : 'no';

  return <span className={`boolean-yesno ${cssClass}`}>{displayText}</span>;
});

BooleanYesNo.displayName = 'BooleanYesNo';
