<script lang="ts">
  import type { ColumnDataType } from 'shared-types';
  import {
    AbsoluteDate,
    ProductLink,
    ProgressBar,
    GradeBadge,
    NovaDots,
    BooleanYesNo,
    LargeCounter,
    ProductImage,
    DecimalUnits,
    ColorPill,
    RelativeDate,
    TimeFormat,
    TruncatedText,
    StarRating,
  } from '$lib/components/display';

  let {
    value,
    dataType,
    column,
    row,
    unit,
  }: {
    value: any;
    dataType: ColumnDataType;
    column: string;
    row: Record<string, any>;
    unit?: string;
  } = $props();
</script>

{#if dataType === 'product-link'}
  <ProductLink {value} />
{:else if dataType === 'progress-bar'}
  <ProgressBar {value} />
{:else if dataType === 'grade-badge'}
  <GradeBadge {value} />
{:else if dataType === 'nova-dots'}
  <NovaDots {value} />
{:else if dataType === 'boolean-yesno'}
  <BooleanYesNo {value} />
{:else if dataType === 'large-counter'}
  <LargeCounter {value} />
{:else if dataType === 'product-image'}
  <ProductImage {value} />
{:else if dataType === 'decimal-units'}
  <DecimalUnits {value} {unit} />
{:else if dataType === 'color-pill'}
  <ColorPill {value} />
{:else if dataType === 'relative-date'}
  <RelativeDate {value} />
{:else if dataType === 'time-format'}
  <TimeFormat {value} />
{:else if dataType === 'absolute-date'}
  <AbsoluteDate {value} />
{:else if dataType === 'truncated-text'}
  <TruncatedText {value} />
{:else if dataType === 'star-rating'}
  <StarRating {value} />
{:else}
  {value ?? ''}
{/if}
