import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'aff-absolute-date',
  imports: [],
  templateUrl: './absolute-date.html',
  styleUrl: './absolute-date.css',
})
export class AbsoluteDate {
  readonly value = input.required<string>();

  readonly formattedDate = computed(() => {
    const dateStr = this.value();
    let result: string;
    if (!dateStr) {
      result = '';
    } else {
      const date = new Date(dateStr);
      result = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return result;
  });
}
