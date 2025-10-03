import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'aff-text-search',
  imports: [],
  templateUrl: './text-search.html',
  styleUrl: './text-search.css'
})
export class TextSearch {
  readonly placeholder = input<string>('Search');
  readonly valueChange = output<string>();

  readonly searchValue = signal('');

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchValue.set(target.value);
  }

  onBlur() {
    this.valueChange.emit(this.searchValue());
  }

  onKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.valueChange.emit(this.searchValue());
    }
  }
}
