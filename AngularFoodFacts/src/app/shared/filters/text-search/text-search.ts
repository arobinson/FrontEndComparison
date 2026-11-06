import { Component, computed, inject, input } from '@angular/core';
import { FilterStore } from '../filter-store';

@Component({
  selector: 'aff-text-search',
  imports: [],
  templateUrl: './text-search.html',
  styleUrl: './text-search.css',
})
export class TextSearch {
  readonly column = input.required<string>();
  readonly placeholder = input<string>('Search');

  readonly #store = inject(FilterStore);

  readonly searchValue = computed(
    () => (this.#store.draft(this.column()) as string | undefined) ?? '',
  );

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.#store.setDraft(this.column(), target.value);
  }

  onBlur() {
    this.#store.apply(this.column());
  }

  onKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.#store.apply(this.column());
    }
  }
}
