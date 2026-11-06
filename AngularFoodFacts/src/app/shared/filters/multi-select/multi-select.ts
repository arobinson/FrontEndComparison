import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { AffButton } from '../../aff-button/aff-button';

/**
 * Generic controlled multi-select dropdown.
 * - `value` changes on every toggle (new array, insertion order)
 */
@Component({
  selector: 'aff-multi-select',
  imports: [AffButton],
  templateUrl: './multi-select.html',
  styleUrl: './multi-select.css',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class MultiSelect {
  readonly options = input.required<string[]>();
  readonly value = model<string[]>([]);
  readonly placeholder = input<string>('Select...');

  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

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

  toggleDropdown() {
    this.isOpen.update((open) => !open);
  }

  /** Close the dropdown on a click anywhere outside this component. */
  onDocumentClick(event: MouseEvent) {
    if (
      this.isOpen() &&
      !this.#elementRef.nativeElement.contains(event.target as Node)
    ) {
      this.isOpen.set(false);
    }
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
