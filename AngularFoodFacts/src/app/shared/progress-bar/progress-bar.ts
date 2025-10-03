import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'aff-progress-bar',
  imports: [],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css'
})
export class ProgressBar {
  readonly value = input.required<number>();

  readonly percentage = computed(() => {
    const val = this.value();
    let result: number;
    if (val < 0) {
      result = 0;
    } else if (val > 100) {
      result = 100;
    } else {
      result = val;
    }
    return result;
  });

  readonly colorClass = computed(() => {
    const pct = this.percentage();
    let result: string;
    if (pct >= 70) {
      result = 'high';
    } else if (pct >= 40) {
      result = 'medium';
    } else {
      result = 'low';
    }
    return result;
  });
}
