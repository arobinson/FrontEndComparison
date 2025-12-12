import { Component, input, signal, effect } from '@angular/core';

@Component({
  selector: 'aff-product-image',
  imports: [],
  templateUrl: './product-image.html',
  styleUrl: './product-image.css',
})
export class ProductImage {
  readonly value = input.required<string>();
  readonly size = input<'small' | 'large'>('small');

  readonly imageLoaded = signal(false);
  readonly imageError = signal(false);

  constructor() {
    // Reset loading state when URL changes
    effect(() => {
      this.imageLoaded.set(false);
      this.imageError.set(false);
      this.value(); // Track the input
    });
  }

  onImageLoad() {
    this.imageLoaded.set(true);
  }

  onImageError() {
    this.imageError.set(true);
  }
}
