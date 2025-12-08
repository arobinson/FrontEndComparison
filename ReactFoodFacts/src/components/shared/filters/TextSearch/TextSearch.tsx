import { memo, useState, useEffect, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import './TextSearch.css';

interface TextSearchProps {
  placeholder?: string;
  resetTrigger?: number;
  onValueChange: (value: string) => void;
}

export const TextSearch = memo(({
  placeholder = 'Search',
  resetTrigger = 0,
  onValueChange,
}: TextSearchProps) => {
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setSearchValue('');
  }, [resetTrigger]);

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    onValueChange(searchValue);
  }, [searchValue, onValueChange]);

  const handleKeyUp = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onValueChange(searchValue);
    }
  }, [searchValue, onValueChange]);

  return (
    <input
      type="text"
      className="text-search-input"
      placeholder={placeholder}
      value={searchValue}
      onChange={handleInput}
      onBlur={handleBlur}
      onKeyUp={handleKeyUp}
    />
  );
});

TextSearch.displayName = 'TextSearch';
