import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { useFilterDraft, useFilterDispatch } from '../filterStore';
import './MultiSelect.css';

interface MultiSelectProps {
  column: string;
  options: string[];
  placeholder?: string;
}

const NO_SELECTION: string[] = [];

export const MultiSelect = memo(({
  column,
  options,
  placeholder = 'Select...',
}: MultiSelectProps) => {
  const selectedValues = useFilterDraft<string[]>(column) ?? NO_SELECTION;
  const dispatch = useFilterDispatch();
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

  // Every toggle updates the selection and applies it immediately.
  const toggleOption = useCallback((option: string) => {
    const next = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];
    dispatch({ type: 'setDraft', column, value: next });
    dispatch({ type: 'apply', column });
  }, [selectedValues, dispatch, column]);

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
      <button className="select-toggle" onClick={toggleDropdown} type="button">
        <span>{getDisplayText()}</span>
        <span className="arrow">▼</span>
      </button>

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
