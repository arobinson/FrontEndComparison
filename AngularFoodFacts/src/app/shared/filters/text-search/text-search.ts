import {
  Component,
  input,
  output,
  signal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'aff-text-search',
  imports: [],
  templateUrl: './text-search.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './text-search.css',
})
export class TextSearch {
  readonly placeholder = input<string>('Search');
  readonly resetTrigger = input<number>(0);
  readonly valueChange = output<string>();

  readonly searchValue = signal('');

  constructor() {
    effect(() => {
      this.resetTrigger();
      this.clear();
    });
  }

  clear() {
    this.searchValue.set('');
  }

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
