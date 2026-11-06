import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { FilterStore } from '../filter-store';

@Component({
  selector: 'aff-multi-select',
  imports: [],
  templateUrl: './multi-select.html',
  styleUrl: './multi-select.css',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class MultiSelect {
  readonly column = input.required<string>();
  readonly options = input.required<string[]>();
  readonly placeholder = input<string>('Select...');

  readonly #store = inject(FilterStore);
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly isOpen = signal(false);

  readonly selectedValues = computed(
    () => (this.#store.draft(this.column()) as string[] | undefined) ?? [],
  );

  readonly displayText = computed(() => {
    const selected = this.selectedValues();
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
    const current = this.selectedValues();
    const next = current.includes(option)
      ? current.filter((value) => value !== option)
      : [...current, option];
    this.#store.setDraft(this.column(), next);
    this.#store.apply(this.column());
  }
}
