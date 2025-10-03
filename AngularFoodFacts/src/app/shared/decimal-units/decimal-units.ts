import { Component, input } from '@angular/core';

@Component({
  selector: 'aff-decimal-units',
  imports: [],
  templateUrl: './decimal-units.html',
  styleUrl: './decimal-units.css',
})
export class DecimalUnits {
  readonly value = input.required<string | number>();
  readonly unit = input<string>('');
}
