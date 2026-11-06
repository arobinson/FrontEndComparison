import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'aff-product-link',
  imports: [RouterLink],
  templateUrl: './product-link.html',
  styleUrl: './product-link.css',
})
export class ProductLink {
  readonly value = input.required<string | number>();
}
