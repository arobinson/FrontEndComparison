import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'aff-product-image',
  imports: [],
  templateUrl: './product-image.html',
  styleUrl: './product-image.css'
})
export class ProductImage {
  readonly value = input.required<string>();
  readonly size = input<'small' | 'large'>('small');

  readonly imageLoaded = signal(false);
  readonly imageError = signal(false);

  onImageLoad() {
    this.imageLoaded.set(true);
  }

  onImageError() {
    this.imageError.set(true);
  }
}
