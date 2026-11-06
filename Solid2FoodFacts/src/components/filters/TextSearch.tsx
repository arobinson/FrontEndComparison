import './TextSearch.css';

interface TextSearchProps {
  value: string;
  placeholder?: string;
  /** Every keystroke: the new text */
  onValueChange: (value: string) => void;
  /** Blur or Enter: the user is done editing */
  onCommit: () => void;
}

export default function TextSearch(props: TextSearchProps) {
  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      props.onCommit();
    }
  };

  return (
    <input
      type="text"
      class="text-search-input"
      placeholder={props.placeholder ?? 'Search'}
      value={props.value}
      onInput={(event) => props.onValueChange(event.currentTarget.value)}
      onBlur={() => props.onCommit()}
      onKeyUp={handleKeyUp}
    />
  );
}
