import { createSignal, For, onCleanup, Show } from 'solid-js';
import Button from '../shared/Button';
import './MultiSelect.css';

interface MultiSelectProps {
  options: string[];
  value: string[];
  placeholder?: string;
  /** Every toggle: the new selection (insertion order) */
  onValueChange: (value: string[]) => void;
}

export default function MultiSelect(props: MultiSelectProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  let container!: HTMLDivElement;

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

  function toggleOption(option: string) {
    const current = props.value;
    props.onValueChange(current.includes(option) ? current.filter((value) => value !== option) : [...current, option]);
  }

  const displayText = () => {
    const values = props.value;
    if (values.length === 0) return props.placeholder ?? 'Select...';
    if (values.length === 1) return values[0];
    return `${values.length} selected`;
  };

  return (
    <div class="multi-select" ref={container}>
      <Button size="sm" class="select-toggle" onClick={() => setIsOpen(!isOpen())}>
        <span>{displayText()}</span>
        <span class="arrow">▼</span>
      </Button>

      <Show when={isOpen()}>
        <div class="dropdown">
          <For each={props.options}>
            {(option) => (
              <label class="option">
                <input type="checkbox" checked={props.value.includes(option)} onChange={() => toggleOption(option)} />
                <span>{option}</span>
              </label>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
