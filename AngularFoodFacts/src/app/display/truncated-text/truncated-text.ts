import { Component, computed, input, model } from '@angular/core';
import { AffButton } from '../../controls/aff-button/aff-button';

@Component({
  selector: 'aff-truncated-text',
  imports: [AffButton],
  templateUrl: './truncated-text.html',
  styleUrl: './truncated-text.css',
})
export class TruncatedText {
  readonly value = input.required<string>();
  readonly maxLength = input<number>(50);

  /** Controlled: the parent owns the expanded state and binds it with [(expanded)] */
  readonly expanded = model(false);

  readonly shouldTruncate = computed(
    () => this.value()?.length > this.maxLength(),
  );

  readonly displayText = computed(() => {
    const text = this.value() || '';
    let result: string;
    if (this.shouldTruncate() && !this.expanded()) {
      // Subtract 3 for the "..." so total length doesn't exceed maxLength
      result = text.substring(0, this.maxLength() - 3) + '...';
    } else {
      result = text;
    }
    return result;
  });

  readonly toggleLabel = computed(() =>
    this.expanded() ? 'Show less' : 'Show more',
  );

  toggleExpanded() {
    this.expanded.set(!this.expanded());
  }
}
