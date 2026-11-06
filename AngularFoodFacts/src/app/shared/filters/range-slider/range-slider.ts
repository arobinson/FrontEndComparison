import { Component, computed, input, model, output } from '@angular/core';

/** A numeric range; a bound is absent when its input is empty. */
export interface RangeValue {
  min?: number;
  max?: number;
}

/**
 * Generic controlled min/max number input pair.
 * - `value` changes on every input (contains only the bounds that are set)
 * - `commit` fires on blur of either input
 * - `min` / `max` are the bounds for the inputs' attributes
 */
@Component({
  selector: 'aff-range-slider',
  imports: [],
  templateUrl: './range-slider.html',
  styleUrl: './range-slider.css',
})
export class RangeSlider {
  readonly value = model<RangeValue>({});
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly commit = output<void>();

  readonly minValue = computed(() => this.value().min);
  readonly maxValue = computed(() => this.value().max);

  onMinChange(event: Event) {
    this.#setValue(this.#parse(event), this.maxValue());
  }

  onMaxChange(event: Event) {
    this.#setValue(this.minValue(), this.#parse(event));
  }

  #parse(event: Event): number | undefined {
    const target = event.target as HTMLInputElement;
    return target.value === '' ? undefined : Number(target.value);
  }

  /** The value only contains the bounds that are set. */
  #setValue(min: number | undefined, max: number | undefined) {
    const value: RangeValue = {};
    if (min !== undefined) {
      value.min = min;
    }
    if (max !== undefined) {
      value.max = max;
    }
    this.value.set(value);
  }
}
