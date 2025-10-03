import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'aff-truncated-text',
  imports: [],
  templateUrl: './truncated-text.html',
  styleUrl: './truncated-text.css',
})
export class TruncatedText {
  readonly value = input.required<string>();
  readonly maxLength = input<number>(50);

  readonly isExpanded = signal(false);

  toggleExpanded() {
    this.isExpanded.update((val) => !val);
  }

  shouldTruncate(): boolean {
    return this.value()?.length > this.maxLength();
  }

  getDisplayText(): string {
    const text = this.value() || '';
    let result: string;
    if (this.shouldTruncate() && !this.isExpanded()) {
      // Subtract 3 for the "..." so total length doesn't exceed maxLength
      result = text.substring(0, this.maxLength() - 3) + '...';
    } else {
      result = text;
    }
    return result;
  }
}
