import { createSignal, createEffect, createMemo, For, Show } from 'solid-js';
import './MultiSelect.css';

interface MultiSelectProps {
  options?: string[];
  resetTrigger?: number;
  onValueChange?: (value: string[]) => void;
}

export default function MultiSelect(props: MultiSelectProps) {
  const [selected, setSelected] = createSignal<Set<string>>(new Set());
  const [isOpen, setIsOpen] = createSignal(false);

  const options = () => props.options ?? [];

  // Reset when trigger changes
  createEffect(() => {
    if (props.resetTrigger) {
      setSelected(new Set());
    }
  });

  function toggleOption(option: string) {
    const newSelected = new Set(selected());
    if (newSelected.has(option)) {
      newSelected.delete(option);
    } else {
      newSelected.add(option);
    }
    setSelected(newSelected);
    props.onValueChange?.([...newSelected]);
  }

  const displayText = createMemo(() =>
    selected().size === 0 ? 'All' : `${selected().size} selected`
  );

  return (
    <div class="multi-select">
      <button
        type="button"
        class="select-button"
        onClick={() => setIsOpen(!isOpen())}
      >
        {displayText()}
        <span class="arrow">{isOpen() ? '▲' : '▼'}</span>
      </button>

      <Show when={isOpen()}>
        <div class="dropdown">
          <For each={options()}>
            {(option) => (
              <label class="option">
                <input
                  type="checkbox"
                  checked={selected().has(option)}
                  onChange={() => toggleOption(option)}
                />
                {option}
              </label>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
