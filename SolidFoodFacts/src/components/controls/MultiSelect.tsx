import { createSignal, createUniqueId, For, Show } from 'solid-js';
import Button from './Button';
import './MultiSelect.css';

interface MultiSelectProps {
  options: string[];
  value: string[];
  placeholder?: string;
  /** Every toggle: the new selection (insertion order) */
  onValueChange: (value: string[]) => void;
}

/**
 * Controlled checkbox dropdown. The dropdown is a native popover: the toggle button opens and
 * closes it, and the browser closes it on an outside click or Escape. The options only render
 * while it is open.
 */
export default function MultiSelect(props: MultiSelectProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const dropdownId = createUniqueId();

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
    <div class="multi-select">
      <Button size="sm" class="select-toggle" popoverTarget={dropdownId}>
        <span>{displayText()}</span>
        <span class="arrow">▼</span>
      </Button>

      <div id={dropdownId} class="dropdown" popover="auto" onBeforeToggle={(event) => setIsOpen(event.newState === 'open')}>
        <Show when={isOpen()}>
          <For each={props.options}>
            {(option) => (
              <label class="option">
                <input type="checkbox" checked={props.value.includes(option)} onChange={() => toggleOption(option)} />
                <span>{option}</span>
              </label>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}
