import { useFilterStore } from './filterStore';
import './TextSearch.css';

interface TextSearchProps {
  column: string;
  placeholder?: string;
}

export default function TextSearch(props: TextSearchProps) {
  const store = useFilterStore();

  // Typing only updates the draft; the filter is applied on blur or Enter.
  const handleInput = (event: InputEvent & { currentTarget: HTMLInputElement }) => {
    store.setDraft(props.column, event.currentTarget.value);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      store.apply(props.column);
    }
  };

  return (
    <input
      type="text"
      class="text-search-input"
      placeholder={props.placeholder ?? 'Search'}
      value={(store.state.draft[props.column] as string | undefined) ?? ''}
      onInput={handleInput}
      onBlur={() => store.apply(props.column)}
      onKeyUp={handleKeyUp}
    />
  );
}
