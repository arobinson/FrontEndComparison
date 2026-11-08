import { Component, computed, input } from '@angular/core';
import { getColumnConfig } from 'shared-types';
import { ProductViewModel } from '../../products/food-facts';
import { ProductLink } from '../../display/product-link/product-link';
import { ProgressBar } from '../../display/progress-bar/progress-bar';
import { GradeBadge } from '../../display/grade-badge/grade-badge';
import { NovaDots } from '../../display/nova-dots/nova-dots';
import { TruncatedText } from '../../display/truncated-text/truncated-text';
import { LargeCounter } from '../../display/large-counter/large-counter';
import { BooleanYesno } from '../../display/boolean-yesno/boolean-yesno';
import { ProductImage } from '../../display/product-image/product-image';
import { DecimalUnits } from '../../display/decimal-units/decimal-units';
import { AbsoluteDate } from '../../display/absolute-date/absolute-date';
import { RelativeDate } from '../../display/relative-date/relative-date';
import { TimeFormat } from '../../display/time-format/time-format';
import { ColorPill } from '../../display/color-pill/color-pill';
import { StarRating } from '../../display/star-rating/star-rating';

/**
 * Renders one table cell by column data type (mirrors React's CellRenderer).
 */
@Component({
  selector: 'aff-cell-renderer',
  imports: [
    ProductLink,
    ProgressBar,
    GradeBadge,
    NovaDots,
    TruncatedText,
    LargeCounter,
    BooleanYesno,
    ProductImage,
    DecimalUnits,
    AbsoluteDate,
    RelativeDate,
    TimeFormat,
    ColorPill,
    StarRating,
  ],
  templateUrl: './cell-renderer.html',
})
export class CellRenderer {
  // #region Input Signals

  /**
   * Column key (from shared-types allColumns)
   */
  readonly column = input.required<string>();

  /**
   * The row object the cell belongs to
   */
  readonly row = input.required<Record<string, any>>();

  // #endregion

  // #region Computed Signals

  readonly #config = computed(() =>
    getColumnConfig(this.column() as keyof ProductViewModel),
  );

  /**
   * Cell value for this column
   */
  protected readonly value = computed(() => this.row()[this.column()]);

  /**
   * Column data type (simple-text when the column is unknown)
   */
  protected readonly dataType = computed(
    () => this.#config()?.type ?? 'simple-text',
  );

  /**
   * Unit for decimal-units columns ('' when none)
   */
  protected readonly unit = computed(() => this.#config()?.unit ?? '');

  // #endregion
}
