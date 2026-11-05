import type { TargetedEvent, TargetedKeyboardEvent } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import './TextSearch.css';

interface TextSearchProps {
  placeholder?: string;
  resetTrigger?: number;
  onValueChange: (value: string) => void;
}

// Plain component: the React version's memo never bails out, because the
// parent passes a fresh inline `onValueChange` closure on every render.
export const TextSearch = ({
  placeholder = 'Search',
  resetTrigger = 0,
  onValueChange,
}: TextSearchProps) => {
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setSearchValue('');
  }, [resetTrigger]);

  const handleInput = useCallback((event: TargetedEvent<HTMLInputElement>) => {
    setSearchValue(event.currentTarget.value);
  }, []);

  const handleBlur = useCallback(() => {
    onValueChange(searchValue);
  }, [searchValue, onValueChange]);

  const handleKeyUp = useCallback((event: TargetedKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onValueChange(searchValue);
    }
  }, [searchValue, onValueChange]);

  // onInput = React's onChange for text inputs (fires on every keystroke).
  return (
    <input
      type="text"
      className="text-search-input"
      placeholder={placeholder}
      value={searchValue}
      onInput={handleInput}
      onBlur={handleBlur}
      onKeyUp={handleKeyUp}
    />
  );
};
