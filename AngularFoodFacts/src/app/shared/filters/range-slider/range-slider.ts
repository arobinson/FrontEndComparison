import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'aff-range-slider',
  imports: [],
  templateUrl: './range-slider.html',
  styleUrl: './range-slider.css'
})
export class RangeSlider {
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly valueChange = output<{ min: number; max: number }>();

  readonly minValue = signal(0);
  readonly maxValue = signal(100);

  onMinChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.minValue.set(Number(target.value));
  }

  onMaxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.maxValue.set(Number(target.value));
  }

  onBlur() {
    this.valueChange.emit({ min: this.minValue(), max: this.maxValue() });
  }
}
