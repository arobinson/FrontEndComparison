import { Component, model, input, output } from '@angular/core';

/**
 * Generic controlled text input.
 * - `value` changes on every keystroke
 * - `commit` fires on blur and on Enter keyup
 */
@Component({
  selector: 'aff-text-search',
  imports: [],
  templateUrl: './text-search.html',
  styleUrl: './text-search.css',
})
export class TextSearch {
  readonly value = model<string>('');
  readonly placeholder = input<string>('Search');
  readonly commit = output<void>();

  onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  onKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.commit.emit();
    }
  }
}
