import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'aff-large-counter',
  imports: [],
  templateUrl: './large-counter.html',
  styleUrl: './large-counter.css'
})
export class LargeCounter {
  readonly value = input.required<number>();

  readonly formattedValue = computed(() => {
    const num = this.value();
    let result: string;
    if (num >= 1000000) {
      result = (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      result = num.toLocaleString('en-US');
    } else {
      result = num.toString();
    }
    return result;
  });
}
