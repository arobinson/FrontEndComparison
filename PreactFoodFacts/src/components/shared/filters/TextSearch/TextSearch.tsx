import type { TargetedEvent, TargetedKeyboardEvent } from 'preact';
import './TextSearch.css';

interface TextSearchProps {
  value: string;
  placeholder?: string;
  /** Every keystroke, with the new text. */
  onValueChange: (value: string) => void;
  /** Blur or Enter: the user is done editing. */
  onCommit: () => void;
}

export const TextSearch = ({
  value,
  placeholder = 'Search',
  onValueChange,
  onCommit,
}: TextSearchProps) => {
  const handleInput = (event: TargetedEvent<HTMLInputElement>) => {
    onValueChange(event.currentTarget.value);
  };

  const handleKeyUp = (event: TargetedKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onCommit();
    }
  };

  // onInput = React's onChange for text inputs (fires on every keystroke).
  return (
    <input
      type="text"
      className="text-search-input"
      placeholder={placeholder}
      value={value}
      onInput={handleInput}
      onBlur={onCommit}
      onKeyUp={handleKeyUp}
    />
  );
};
