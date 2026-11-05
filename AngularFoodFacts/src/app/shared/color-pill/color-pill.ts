import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aff-color-pill',
  imports: [],
  templateUrl: './color-pill.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './color-pill.css',
})
export class ColorPill {
  readonly value = input.required<string>();
}
