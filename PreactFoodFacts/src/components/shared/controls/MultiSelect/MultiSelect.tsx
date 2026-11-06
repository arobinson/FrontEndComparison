import { useState, useId } from 'preact/hooks';
import { Button } from '../../Button';
import './MultiSelect.css';

interface MultiSelectProps {
  options: string[];
  value: string[];
  placeholder?: string;
  /** Every toggle, with the new selection (in the order options were selected). */
  onValueChange: (value: string[]) => void;
}

/**
 * Controlled checkbox dropdown. The dropdown is a native popover: the toggle button opens and
 * closes it, and the browser closes it on an outside click or Escape. The options only render
 * while it is open.
 */
export const MultiSelect = ({
  options,
  value: selectedValues,
  placeholder = 'Select...',
  onValueChange,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownId = useId();

  const toggleOption = (option: string) => {
    const next = selectedValues.includes(option)
      ? selectedValues.filter((selected) => selected !== option)
      : [...selectedValues, option];
    onValueChange(next);
  };

  const getDisplayText = () => {
    const count = selectedValues.length;
    if (count === 0) {
      return placeholder;
    } else if (count === 1) {
      return selectedValues[0];
    } else {
      return `${count} selected`;
    }
  };

  return (
    <div className="multi-select">
      <Button size="sm" className="select-toggle" popoverTarget={dropdownId}>
        <span>{getDisplayText()}</span>
        <span className="arrow">▼</span>
      </Button>

      <div
        id={dropdownId}
        className="dropdown"
        popover="auto"
        onBeforeToggle={(event) => setIsOpen(event.newState === 'open')}
      >
        {isOpen && options.map((option) => (
          <label key={option} className="option">
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => toggleOption(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
