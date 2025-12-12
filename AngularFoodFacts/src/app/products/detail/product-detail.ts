import { Component, inject, computed, signal, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FoodFacts, ProductViewModel } from '../food-facts';
import { MockProductViewModel } from 'shared-types';
import { ProgressBar } from '../../shared/progress-bar/progress-bar';
import { GradeBadge } from '../../shared/grade-badge/grade-badge';
import { NovaDots } from '../../shared/nova-dots/nova-dots';
import { ProductImage } from '../../shared/product-image/product-image';
import { TruncatedText } from '../../shared/truncated-text/truncated-text';
import { LargeCounter } from '../../shared/large-counter/large-counter';
import { AbsoluteDate } from '../../shared/absolute-date/absolute-date';
import { RelativeDate } from '../../shared/relative-date/relative-date';
import { BooleanYesno } from '../../shared/boolean-yesno/boolean-yesno';
import { DecimalUnits } from '../../shared/decimal-units/decimal-units';
import { TimeFormat } from '../../shared/time-format/time-format';
import { StarRating } from '../../shared/star-rating/star-rating';
import { ColorPill } from '../../shared/color-pill/color-pill';
import { AffButton } from '../../shared/aff-button/aff-button';

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
    BooleanYesno,
    DecimalUnits,
    TimeFormat,
    StarRating,
    ColorPill,
    AffButton,
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
  readonly adjacentResource = this.#foodFacts.createAdjacentProductsResource(
    this.id,
  );

  // Keep previous product value during loading to prevent component destruction
  readonly product = signal<ProductViewModel | null>(null);

  constructor() {
    // Update id signal when route params change (component is reused)
    this.#route.params.subscribe((params) => {
      this.id.set(params['id']);
    });

    // Effect to update product signal, preserving previous value during loading
    effect(() => {
      const current = this.productResource.value();
      if (current) {
        this.product.set(current);
      }
    });
  }

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

  readonly hasPrevious = computed(() => {
    const adjacent = this.adjacentResource.value();
    return adjacent?.previousId != null;
  });

  readonly hasNext = computed(() => {
    const adjacent = this.adjacentResource.value();
    return adjacent?.nextId != null;
  });

  readonly positionInfo = computed(() => {
    const adjacent = this.adjacentResource.value();
    if (adjacent) {
      return `${adjacent.currentIndex} of ${adjacent.total}`;
    }
    return '';
  });

  navigateToList(): void {
    this.#router.navigate(['/list']);
  }

  navigateToPrevious(): void {
    const adjacent = this.adjacentResource.value();
    if (adjacent?.previousId) {
      this.#router.navigate(['/detail', adjacent.previousId]);
    }
  }

  navigateToNext(): void {
    const adjacent = this.adjacentResource.value();
    if (adjacent?.nextId) {
      this.#router.navigate(['/detail', adjacent.nextId]);
    }
  }
}
