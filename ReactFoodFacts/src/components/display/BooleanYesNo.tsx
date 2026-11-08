import './BooleanYesNo.css';

interface BooleanYesNoProps {
  value: boolean;
}

export function BooleanYesNo({ value }: BooleanYesNoProps) {
  const displayText = value ? 'Yes' : 'No';
  const cssClass = value ? 'yes' : 'no';

  return <span className={`boolean-yesno ${cssClass}`}>{displayText}</span>;
}
