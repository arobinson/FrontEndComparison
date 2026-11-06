import { Component, input } from '@angular/core';

@Component({
  selector: 'aff-color-pill',
  imports: [],
  templateUrl: './color-pill.html',
  styleUrl: './color-pill.css',
})
export class ColorPill {
  readonly value = input.required<string>();
}
