import type { TargetedMouseEvent } from 'preact';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { useFilterActions, useFilterDraft } from '../filterStore';
import './MultiSelect.css';

interface MultiSelectProps {
  column: string;
  options: string[];
  placeholder?: string;
}

export const MultiSelect = ({
  column,
  options,
  placeholder = 'Select...',
}: MultiSelectProps) => {
  const selectedValues = useFilterDraft<string[]>(column) ?? [];
  const { setDraft, apply } = useFilterActions();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastClickWhenOpenedRef = useRef<EventTarget | null>(null);

  // Real side effect: a document-level click listener (click-outside to close).
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

  const toggleDropdown = useCallback((event: TargetedMouseEvent<HTMLButtonElement>) => {
    const willBeOpen = !isOpen;
    if (willBeOpen) {
      lastClickWhenOpenedRef.current = event.target;
    }
    setIsOpen(willBeOpen);
  }, [isOpen]);

  // Multi-select applies on every toggle.
  const toggleOption = (option: string) => {
    const next = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];
    setDraft(column, next);
    apply(column);
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
};
