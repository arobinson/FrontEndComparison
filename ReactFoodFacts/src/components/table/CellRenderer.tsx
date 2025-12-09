import { memo } from 'react';
import type { ColumnConfig } from '../../config/columnConfig';
import {
  TruncatedText,
  ProgressBar,
  GradeBadge,
  NovaDots,
  LargeCounter,
  DecimalUnits,
  AbsoluteDate,
  RelativeDate,
  TimeFormat,
  BooleanYesNo,
  ProductImage,
  ProductLink,
  StarRating,
  ColorPill,
} from '../display';

interface CellRendererProps {
  column: ColumnConfig;
  row: Record<string, any>;
}

export const CellRenderer = memo(({ column, row }: CellRendererProps) => {
  const value = row[column.key];

  let cell;
  if (column.type === 'product-link') {
    cell = <ProductLink code={String(row.code)} label={String(value ?? row.code)} />;
  } else if (column.type === 'simple-text') {
    cell = value ?? '';
  } else if (column.type === 'truncated-text') {
    cell = <TruncatedText value={value} />;
  } else if (column.type === 'progress-bar') {
    cell = <ProgressBar value={value ?? 0} />;
  } else if (column.type === 'grade-badge') {
    cell = <GradeBadge grade={value} />;
  } else if (column.type === 'nova-dots') {
    cell = <NovaDots rating={value} />;
  } else if (column.type === 'large-counter') {
    cell = <LargeCounter value={value} />;
  } else if (column.type === 'decimal-units' && column.unit) {
    cell = <DecimalUnits value={value} unit={column.unit} />;
  } else if (column.type === 'absolute-date') {
    cell = <AbsoluteDate value={value} />;
  } else if (column.type === 'relative-date') {
    cell = <RelativeDate value={value} />;
  } else if (column.type === 'time-format') {
    cell = <TimeFormat value={value} />;
  } else if (column.type === 'boolean-yesno') {
    cell = <BooleanYesNo value={value} />;
  } else if (column.type === 'product-image') {
    cell = <ProductImage value={value} />;
  } else if (column.type === 'star-rating') {
    cell = <StarRating value={value} />;
  } else if (column.type === 'color-pill') {
    cell = <ColorPill value={value} />;
  } else {
    cell = value ?? '';
  }

  return cell;
});

CellRenderer.displayName = 'CellRenderer';
