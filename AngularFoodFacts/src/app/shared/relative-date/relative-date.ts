import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'aff-relative-date',
  imports: [],
  templateUrl: './relative-date.html',
  styleUrl: './relative-date.css'
})
export class RelativeDate {
  readonly value = input.required<string>();

  readonly relativeTime = computed(() => {
    const dateStr = this.value();
    let result: string;
    if (!dateStr) {
      result = '';
    } else {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) {
        result = 'just now';
      } else if (diffMins < 60) {
        result = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        result = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        result = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      }
    }
    return result;
  });
}
