import { Component, computed, input } from '@angular/core';
import { getColumnConfig } from 'shared-types';
import { ProductViewModel } from '../../products/food-facts';
import { ProductLink } from '../product-link/product-link';
import { ProgressBar } from '../progress-bar/progress-bar';
import { GradeBadge } from '../grade-badge/grade-badge';
import { NovaDots } from '../nova-dots/nova-dots';
import { TruncatedText } from '../truncated-text/truncated-text';
import { LargeCounter } from '../large-counter/large-counter';
import { BooleanYesno } from '../boolean-yesno/boolean-yesno';
import { ProductImage } from '../product-image/product-image';
import { DecimalUnits } from '../decimal-units/decimal-units';
import { AbsoluteDate } from '../absolute-date/absolute-date';
import { RelativeDate } from '../relative-date/relative-date';
import { TimeFormat } from '../time-format/time-format';
import { ColorPill } from '../color-pill/color-pill';
import { StarRating } from '../star-rating/star-rating';

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
