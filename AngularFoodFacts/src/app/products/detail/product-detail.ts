import { Component, inject, computed, input, linkedSignal } from '@angular/core';
import { Router } from '@angular/router';
import { FoodFacts, ProductViewModel } from '../food-facts';
import { ProgressBar } from '../../display/progress-bar/progress-bar';
import { GradeBadge } from '../../display/grade-badge/grade-badge';
import { NovaDots } from '../../display/nova-dots/nova-dots';
import { ProductImage } from '../../display/product-image/product-image';
import { TruncatedText } from '../../display/truncated-text/truncated-text';
import { LargeCounter } from '../../display/large-counter/large-counter';
import { AbsoluteDate } from '../../display/absolute-date/absolute-date';
import { RelativeDate } from '../../display/relative-date/relative-date';
import { BooleanYesno } from '../../display/boolean-yesno/boolean-yesno';
import { DecimalUnits } from '../../display/decimal-units/decimal-units';
import { TimeFormat } from '../../display/time-format/time-format';
import { StarRating } from '../../display/star-rating/star-rating';
import { ColorPill } from '../../display/color-pill/color-pill';
import { AffButton } from '../../controls/aff-button/aff-button';

/** ISO string for a date (empty when absent), as the date display components take strings */
const toIso = (date: Date | undefined): string => (date ? date.toISOString() : '');

@Component({
  selector: 'aff-product-detail',
  imports: [
    AffButton,
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
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  readonly #router = inject(Router);
  readonly #foodFacts = inject(FoodFacts);

  /** The `:id` route parameter (bound by withComponentInputBinding; updates when the route is reused) */
  readonly id = input.required<string>();
  readonly productResource = this.#foodFacts.createProductResource(this.id);
  readonly adjacentResource = this.#foodFacts.createAdjacentProductsResource(
    this.id,
  );

  // Keep the previous product shown while the next one loads (prevents component destruction)
  readonly product = linkedSignal<
    ProductViewModel | null | undefined,
    ProductViewModel | null
  >({
    source: () =>
      this.productResource.hasValue() ? this.productResource.value() : undefined,
    computation: (current, previous) => current ?? previous?.value ?? null,
  });

  readonly #adjacent = computed(() =>
    this.adjacentResource.hasValue() ? this.adjacentResource.value() : null,
  );

  readonly isLoading = this.productResource.isLoading;
  readonly isError = computed(() => this.productResource.status() === 'error');
  readonly createdDate = computed(() => toIso(this.product()?.createdDate));

  readonly lastModifiedDate = computed(() => toIso(this.product()?.lastUpdated));

  readonly releaseDate = computed(() => toIso(this.product()?.releaseDate));

  readonly nextRestockDate = computed(() => toIso(this.product()?.nextRestockDate));

  readonly hasPrevious = computed(() => {
    const adjacent = this.#adjacent();
    return adjacent?.previousId != null;
  });

  readonly hasNext = computed(() => {
    const adjacent = this.#adjacent();
    return adjacent?.nextId != null;
  });

  readonly positionInfo = computed(() => {
    const adjacent = this.#adjacent();
    if (adjacent) {
      return `${adjacent.currentIndex} of ${adjacent.total}`;
    }
    return '';
  });

  navigateToList(): void {
    this.#router.navigate(['/list']);
  }

  navigateToPrevious(): void {
    const adjacent = this.#adjacent();
    if (adjacent?.previousId) {
      this.#router.navigate(['/detail', adjacent.previousId]);
    }
  }

  navigateToNext(): void {
    const adjacent = this.#adjacent();
    if (adjacent?.nextId) {
      this.#router.navigate(['/detail', adjacent.nextId]);
    }
  }
}
