import { Component, input, output, signal, effect } from '@angular/core';

@Component({
  selector: 'aff-range-slider',
  imports: [],
  templateUrl: './range-slider.html',
  styleUrl: './range-slider.css',
})
export class RangeSlider {
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly resetTrigger = input<number>(0);
  readonly valueChange = output<{ min: number; max: number }>();

  readonly minValue = signal<number | undefined>(undefined);
  readonly maxValue = signal<number | undefined>(undefined);

  constructor() {
    effect(() => {
      this.resetTrigger();
      this.clear();
    });
  }

  clear() {
    this.minValue.set(undefined);
    this.maxValue.set(undefined);
  }

  onMinChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value === '' ? undefined : Number(target.value);
    this.minValue.set(value);
  }

  onMaxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value === '' ? undefined : Number(target.value);
    this.maxValue.set(value);
  }

  onBlur() {
    const minVal = this.minValue();
    const maxVal = this.maxValue();

    let result: { min?: number; max?: number };
    if (minVal !== undefined || maxVal !== undefined) {
      result = {};
      if (minVal !== undefined) {
        result.min = minVal;
      }
      if (maxVal !== undefined) {
        result.max = maxVal;
      }
    } else {
      result = {};
    }

    this.valueChange.emit(result as { min: number; max: number });
  }
}
