import { Component, inject, computed, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FoodFacts, ProductViewModel } from '../food-facts';
import { ProgressBar } from '../../shared/progress-bar/progress-bar';
import { GradeBadge } from '../../shared/grade-badge/grade-badge';
import { NovaDots } from '../../shared/nova-dots/nova-dots';
import { ProductImage } from '../../shared/product-image/product-image';
import { TruncatedText } from '../../shared/truncated-text/truncated-text';
import { LargeCounter } from '../../shared/large-counter/large-counter';
import { AbsoluteDate } from '../../shared/absolute-date/absolute-date';
import { RelativeDate } from '../../shared/relative-date/relative-date';

@Component({
  selector: 'aff-product-detail',
  imports: [
    ProgressBar,
    GradeBadge,
    NovaDots,
    ProductImage,
    TruncatedText,
    LargeCounter,
    AbsoluteDate,
    RelativeDate,
  ],
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

  readonly createdDate = computed(() => {
    let result: string;
    const date = this.productResource.value()?.createdDate;
    if (date) {
      result = date.toISOString();
    } else {
      result = '';
    }
    return result;
  });

  readonly lastModifiedDate = computed(() => {
    let result: string;
    const date = this.productResource.value()?.lastUpdated;
    if (date) {
      result = date.toISOString();
    } else {
      result = '';
    }
    return result;
  });

  readonly releaseDate = computed(() => {
    let result: string;
    const date = this.productResource.value()?.releaseDate;
    if (date) {
      result = date.toISOString();
    } else {
      result = '';
    }
    return result;
  });

  readonly nextRestockDate = computed(() => {
    let result: string;
    const date = this.productResource.value()?.nextRestockDate;
    if (date) {
      result = date.toISOString();
    } else {
      result = '';
    }
    return result;
  });

  navigateToList(): void {
    this.#router.navigate(['/list']);
  }
}
