import { createSignal, For, onCleanup, Show, useContext } from 'solid-js';
import { FilterStoreContext } from './filterStore';
import './MultiSelect.css';

interface MultiSelectProps {
  column: string;
  options: string[];
  placeholder?: string;
}

const NO_SELECTION: string[] = [];

export default function MultiSelect(props: MultiSelectProps) {
  const store = useContext(FilterStoreContext);
  const [isOpen, setIsOpen] = createSignal(false);
  let container!: HTMLDivElement;

  const selectedValues = () => (store.state.draft[props.column] as string[] | undefined) ?? NO_SELECTION;

  // Click outside closes the dropdown: a plain document listener for the component's lifetime
  // (no effect needed; Solid components run once). The click that opens the dropdown is inside
  // the container, so it never closes it.
  const handleClickOutside = (event: MouseEvent) => {
    if (isOpen() && !container.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };
  document.addEventListener('click', handleClickOutside);
  onCleanup(() => document.removeEventListener('click', handleClickOutside));

  // Every toggle updates the selection and applies it immediately (one store write for both).
  function toggleOption(option: string) {
    const current = selectedValues();
    const next = current.includes(option) ? current.filter((value) => value !== option) : [...current, option];
    store.commit(props.column, next);
  }

  const displayText = () => {
    const values = selectedValues();
    if (values.length === 0) return props.placeholder ?? 'Select...';
    if (values.length === 1) return values[0];
    return `${values.length} selected`;
  };

  return (
    <div class="multi-select" ref={container}>
      <button class="select-toggle" onClick={() => setIsOpen(!isOpen())} type="button">
        <span>{displayText()}</span>
        <span class="arrow">▼</span>
      </button>

      <Show when={isOpen()}>
        <div class="dropdown">
          <For each={props.options}>
            {(option) => (
              <label class="option">
                <input type="checkbox" checked={selectedValues().includes(option)} onChange={() => toggleOption(option)} />
                <span>{option}</span>
              </label>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
