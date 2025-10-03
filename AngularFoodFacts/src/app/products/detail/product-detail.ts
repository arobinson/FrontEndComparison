import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FoodFacts } from '../food-facts';

@Component({
  selector: 'aff-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #foodFacts = inject(FoodFacts);

  readonly id = signal(this.#route.snapshot.params['id']);
  readonly productResource = this.#foodFacts.createProductResource(this.id);

  readonly isLoading = computed(
    () => this.productResource.status() === 'loading',
  );
  readonly isError = computed(() => this.productResource.status() === 'error');
  readonly hasData = computed(
    () =>
      this.productResource.status() === 'resolved' &&
      this.productResource.value(),
  );

  navigateToList(): void {
    this.#router.navigate(['/list']);
  }
}
