import { memo, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import { useFilterDraft, useFilterDispatch } from '../filterStore';
import './TextSearch.css';

interface TextSearchProps {
  column: string;
  placeholder?: string;
}

export const TextSearch = memo(({
  column,
  placeholder = 'Search',
}: TextSearchProps) => {
  const searchValue = useFilterDraft<string>(column) ?? '';
  const dispatch = useFilterDispatch();

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setDraft', column, value: event.target.value });
  }, [dispatch, column]);

  const handleBlur = useCallback(() => {
    dispatch({ type: 'apply', column });
  }, [dispatch, column]);

  const handleKeyUp = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      dispatch({ type: 'apply', column });
    }
  }, [dispatch, column]);

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
