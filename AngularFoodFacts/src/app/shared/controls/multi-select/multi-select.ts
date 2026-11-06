import { Component, computed, input, model, signal } from '@angular/core';
import { AffButton } from '../../aff-button/aff-button';

let nextId = 0;

/**
 * Generic controlled multi-select dropdown.
 * - `value` changes on every toggle (new array, insertion order)
 *
 * The dropdown is a native popover: the toggle button opens and closes it, and the browser
 * closes it on an outside click or Escape. The options only render while it is open.
 */
@Component({
  selector: 'aff-multi-select',
  imports: [AffButton],
  templateUrl: './multi-select.html',
  styleUrl: './multi-select.css',
})
export class MultiSelect {
  readonly options = input.required<string[]>();
  readonly value = model<string[]>([]);
  readonly placeholder = input<string>('Select...');

  readonly dropdownId = `aff-multi-select-${nextId++}`;
  readonly isOpen = signal(false);

  readonly displayText = computed(() => {
    const selected = this.value();
    let result: string;
    if (selected.length === 0) {
      result = this.placeholder();
    } else if (selected.length === 1) {
      result = selected[0];
    } else {
      result = `${selected.length} selected`;
    }
    return result;
  });

  onBeforeToggle(event: Event) {
    this.isOpen.set((event as ToggleEvent).newState === 'open');
  }

  toggleOption(option: string) {
    const current = this.value();
    this.value.set(
      current.includes(option)
        ? current.filter((selected) => selected !== option)
        : [...current, option],
    );
  }
}
