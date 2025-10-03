import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'aff-time-format',
  imports: [],
  templateUrl: './time-format.html',
  styleUrl: './time-format.css'
})
export class TimeFormat {
  readonly value = input.required<string>();

  readonly formattedTime = computed(() => {
    const timeStr = this.value();
    let result: string;
    if (!timeStr) {
      result = '';
    } else {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);

      result = new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    }
    return result;
  });
}
