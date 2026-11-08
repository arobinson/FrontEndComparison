import { memo } from '../../utils/memo';
import './BooleanYesNo.css';

interface BooleanYesNoProps {
  value: boolean;
}

export const BooleanYesNo = memo(function BooleanYesNo({ value }: BooleanYesNoProps) {
  const displayText = value ? 'Yes' : 'No';
  const cssClass = value ? 'yes' : 'no';

  return <span className={`boolean-yesno ${cssClass}`}>{displayText}</span>;
});
