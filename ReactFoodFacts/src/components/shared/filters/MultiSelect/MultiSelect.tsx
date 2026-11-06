import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../../Button';
import './MultiSelect.css';

interface MultiSelectProps {
  options: string[];
  value: string[];
  placeholder?: string;
  /** Every toggle, with the new selection (in the order options were selected). */
  onValueChange: (value: string[]) => void;
}

export const MultiSelect = memo(({
  options,
  value: selectedValues,
  placeholder = 'Select...',
  onValueChange,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastClickWhenOpenedRef = useRef<EventTarget | null>(null);

  // Legitimate effect: subscribes to a document-level click listener (click-outside to close).
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) return;
      if (event.target === lastClickWhenOpenedRef.current) return;

      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const toggleDropdown = useCallback((event: React.MouseEvent) => {
    const willBeOpen = !isOpen;
    if (willBeOpen) {
      lastClickWhenOpenedRef.current = event.target;
    }
    setIsOpen(willBeOpen);
  }, [isOpen]);

  const toggleOption = useCallback((option: string) => {
    const next = selectedValues.includes(option)
      ? selectedValues.filter((selected) => selected !== option)
      : [...selectedValues, option];
    onValueChange(next);
  }, [selectedValues, onValueChange]);

  const getDisplayText = useCallback(() => {
    const count = selectedValues.length;
    if (count === 0) {
      return placeholder;
    } else if (count === 1) {
      return selectedValues[0];
    } else {
      return `${count} selected`;
    }
  }, [selectedValues, placeholder]);

  return (
    <div className="multi-select" ref={containerRef}>
      <Button size="sm" className="select-toggle" onClick={toggleDropdown}>
        <span>{getDisplayText()}</span>
        <span className="arrow">▼</span>
      </Button>

      {isOpen && (
        <div className="dropdown">
          {options.map((option) => (
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
      )}
    </div>
  );
});

MultiSelect.displayName = 'MultiSelect';
