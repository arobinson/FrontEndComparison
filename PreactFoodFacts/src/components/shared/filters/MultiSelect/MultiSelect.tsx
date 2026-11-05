import type { TargetedMouseEvent } from 'preact';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import './MultiSelect.css';

interface MultiSelectProps {
  options: string[];
  placeholder?: string;
  resetTrigger?: number;
  onValueChange: (values: string[]) => void;
}

// Plain component: the React version's memo never bails out, because the
// parent passes a fresh inline `onValueChange` closure (and `options` array
// literal) on every render.
export const MultiSelect = ({
  options,
  placeholder = 'Select...',
  resetTrigger = 0,
  onValueChange,
}: MultiSelectProps) => {
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastClickWhenOpenedRef = useRef<EventTarget | null>(null);

  useEffect(() => {
    setSelectedValues(new Set());
  }, [resetTrigger]);

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

  const toggleOption = useCallback((option: string) => {
    setSelectedValues((current) => {
      const newSet = new Set(current);
      if (newSet.has(option)) {
        newSet.delete(option);
      } else {
        newSet.add(option);
      }
      onValueChange(Array.from(newSet));
      return newSet;
    });
  }, [onValueChange]);

  const getDisplayText = useCallback(() => {
    const count = selectedValues.size;
    if (count === 0) {
      return placeholder;
    } else if (count === 1) {
      return Array.from(selectedValues)[0];
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
                checked={selectedValues.has(option)}
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
