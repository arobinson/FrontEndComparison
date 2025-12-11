import { createEffect, createSignal } from 'solid-js';
import './TextSearch.css';

interface TextSearchProps {
  placeholder?: string;
  resetTrigger?: number;
  onValueChange?: (value: string) => void;
}

export default function TextSearch(props: TextSearchProps) {
  const [inputValue, setInputValue] = createSignal('');

  const onInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setInputValue(value);
    props.onValueChange?.(value);
  };

  createEffect(() => {
    if (props.resetTrigger) {
      setInputValue('');
    }
  });

  return <input type="text" class="text-search" placeholder={props.placeholder ?? 'Search'} onInput={onInput} value={inputValue()} />;
}
