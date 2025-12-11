import { Match, Switch } from 'solid-js';
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
} from '../display';

interface CellRendererProps {
  value: any;
  dataType: ColumnDataType;
  column: string;
  row: Record<string, any>;
  unit?: string;
}

export default function CellRenderer(props: CellRendererProps) {
  return (
    <Switch fallback={<>{props.value ?? ''}</>}>
      <Match when={props.dataType === 'product-link'}>
        <ProductLink value={props.value} />
      </Match>
      <Match when={props.dataType === 'progress-bar'}>
        <ProgressBar value={props.value} />
      </Match>
      <Match when={props.dataType === 'grade-badge'}>
        <GradeBadge value={props.value} />
      </Match>
      <Match when={props.dataType === 'nova-dots'}>
        <NovaDots value={props.value} />
      </Match>
      <Match when={props.dataType === 'boolean-yesno'}>
        <BooleanYesNo value={props.value} />
      </Match>
      <Match when={props.dataType === 'large-counter'}>
        <LargeCounter value={props.value} />
      </Match>
      <Match when={props.dataType === 'product-image'}>
        <ProductImage value={props.value} />
      </Match>
      <Match when={props.dataType === 'decimal-units'}>
        <DecimalUnits value={props.value} unit={props.unit} />
      </Match>
      <Match when={props.dataType === 'color-pill'}>
        <ColorPill value={props.value} />
      </Match>
      <Match when={props.dataType === 'relative-date'}>
        <RelativeDate value={props.value} />
      </Match>
      <Match when={props.dataType === 'time-format'}>
        <TimeFormat value={props.value} />
      </Match>
      <Match when={props.dataType === 'absolute-date'}>
        <AbsoluteDate value={props.value} />
      </Match>
      <Match when={props.dataType === 'truncated-text'}>
        <TruncatedText value={props.value} />
      </Match>
      <Match when={props.dataType === 'star-rating'}>
        <StarRating value={props.value} />
      </Match>
    </Switch>
  );
}
