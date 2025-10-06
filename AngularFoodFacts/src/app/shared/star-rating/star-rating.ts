import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'aff-star-rating',
  imports: [],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
})
export class StarRating {
  readonly value = input.required<number>();
  readonly maxStars = input<number>(5);

  readonly stars = computed(() => {
    const rating = this.value();
    const max = this.maxStars();
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

    let result;
    result = {
      full: Array(fullStars).fill(0),
      half: hasHalfStar ? [0] : [],
      empty: Array(emptyStars).fill(0),
    };
    return result;
  });
}
