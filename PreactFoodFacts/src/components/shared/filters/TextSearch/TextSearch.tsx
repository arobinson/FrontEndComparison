import type { TargetedEvent, TargetedKeyboardEvent } from 'preact';
import { useFilterActions, useFilterDraft } from '../filterStore';
import './TextSearch.css';

interface TextSearchProps {
  column: string;
  placeholder?: string;
}

export const TextSearch = ({ column, placeholder = 'Search' }: TextSearchProps) => {
  const searchValue = useFilterDraft<string>(column) ?? '';
  const { setDraft, apply } = useFilterActions();

  const handleInput = (event: TargetedEvent<HTMLInputElement>) => {
    setDraft(column, event.currentTarget.value);
  };

  const handleBlur = () => {
    apply(column);
  };

  const handleKeyUp = (event: TargetedKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      apply(column);
    }
  };

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
