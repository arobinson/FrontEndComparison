import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'aff-nova-dots',
  imports: [],
  templateUrl: './nova-dots.html',
  styleUrl: './nova-dots.css',
})
export class NovaDots {
  readonly value = input.required<number>();

  readonly rating = computed(() => {
    const val = this.value();
    let result: number;
    if (val < 1) {
      result = 1;
    } else if (val > 4) {
      result = 4;
    } else {
      result = Math.floor(val);
    }
    return result;
  });

  readonly dots = computed(() => {
    const filledCount = this.rating();
    const result = [];
    for (let i = 1; i <= 4; i++) {
      result.push({ filled: i <= filledCount });
    }
    return result;
  });
}
