import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'aff-product-link',
  imports: [RouterModule],
  templateUrl: './product-link.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './product-link.css',
})
export class ProductLink {
  readonly value = input.required<string | number>();
}
