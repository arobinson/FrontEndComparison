import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'aff-grade-badge',
  imports: [],
  templateUrl: './grade-badge.html',
  styleUrl: './grade-badge.css',
})
export class GradeBadge {
  readonly value = input.required<string>();

  readonly gradeClass = computed(() => {
    const grade = this.value()?.toUpperCase();
    let result: string;
    if (grade === 'A') {
      result = 'grade-a';
    } else if (grade === 'B') {
      result = 'grade-b';
    } else if (grade === 'C') {
      result = 'grade-c';
    } else if (grade === 'D') {
      result = 'grade-d';
    } else if (grade === 'F') {
      result = 'grade-f';
    } else {
      result = 'grade-unknown';
    }
    return result;
  });
}
