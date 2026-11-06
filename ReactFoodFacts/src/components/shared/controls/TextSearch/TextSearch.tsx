import { memo, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import './TextSearch.css';

interface TextSearchProps {
  value: string;
  placeholder?: string;
  /** Every keystroke, with the new text. */
  onValueChange: (value: string) => void;
  /** Blur or Enter: the user is done editing. */
  onCommit: () => void;
}

export const TextSearch = memo(({
  value,
  placeholder = 'Search',
  onValueChange,
  onCommit,
}: TextSearchProps) => {
  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  }, [onValueChange]);

  const handleKeyUp = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onCommit();
    }
  }, [onCommit]);

  return (
    <input
      type="text"
      className="text-search-input"
      placeholder={placeholder}
      value={value}
      onChange={handleInput}
      onBlur={onCommit}
      onKeyUp={handleKeyUp}
    />
  );
});

TextSearch.displayName = 'TextSearch';
