import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'aff-product-link',
  imports: [RouterModule],
  templateUrl: './product-link.html',
  styleUrl: './product-link.css'
})
export class ProductLink {
  readonly value = input.required<string | number>();
}
