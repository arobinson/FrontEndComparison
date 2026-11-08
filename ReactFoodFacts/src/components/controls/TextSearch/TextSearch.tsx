import { type KeyboardEvent, type ChangeEvent } from 'react';
import './TextSearch.css';

interface TextSearchProps {
  value: string;
  placeholder?: string;
  /** Every keystroke, with the new text. */
  onValueChange: (value: string) => void;
  /** Blur or Enter: the user is done editing. */
  onCommit: () => void;
}

export function TextSearch({
  value,
  placeholder = 'Search',
  onValueChange,
  onCommit,
}: TextSearchProps) {
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onCommit();
    }
  };

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
}
