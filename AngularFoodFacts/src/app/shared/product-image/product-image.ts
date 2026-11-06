import { Component, input, linkedSignal } from '@angular/core';

@Component({
  selector: 'aff-product-image',
  imports: [],
  templateUrl: './product-image.html',
  styleUrl: './product-image.css',
})
export class ProductImage {
  readonly value = input.required<string>();
  readonly size = input<'small' | 'large'>('small');

  // Loading state resets whenever the image URL changes
  readonly imageLoaded = linkedSignal({
    source: this.value,
    computation: () => false,
  });
  readonly imageError = linkedSignal({
    source: this.value,
    computation: () => false,
  });

  onImageLoad() {
    this.imageLoaded.set(true);
  }

  onImageError() {
    this.imageError.set(true);
  }
}
