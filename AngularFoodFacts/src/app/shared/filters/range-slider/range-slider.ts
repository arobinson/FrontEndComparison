import { Component, computed, inject, input } from '@angular/core';
import { FilterStore, RangeFilterValue } from '../filter-store';

@Component({
  selector: 'aff-range-slider',
  imports: [],
  templateUrl: './range-slider.html',
  styleUrl: './range-slider.css',
})
export class RangeSlider {
  readonly column = input.required<string>();
  readonly min = input<number>(0);
  readonly max = input<number>(100);

  readonly #store = inject(FilterStore);

  readonly #draft = computed(
    () => this.#store.draft(this.column()) as RangeFilterValue | undefined,
  );
  readonly minValue = computed(() => this.#draft()?.min);
  readonly maxValue = computed(() => this.#draft()?.max);

  onMinChange(event: Event) {
    this.#setDraft(this.#parse(event), this.maxValue());
  }

  onMaxChange(event: Event) {
    this.#setDraft(this.minValue(), this.#parse(event));
  }

  onBlur() {
    this.#store.apply(this.column());
  }

  #parse(event: Event): number | undefined {
    const target = event.target as HTMLInputElement;
    return target.value === '' ? undefined : Number(target.value);
  }

  /** The value only contains the bounds that are set. */
  #setDraft(min: number | undefined, max: number | undefined) {
    const value: RangeFilterValue = {};
    if (min !== undefined) {
      value.min = min;
    }
    if (max !== undefined) {
      value.max = max;
    }
    this.#store.setDraft(this.column(), value);
  }
}
