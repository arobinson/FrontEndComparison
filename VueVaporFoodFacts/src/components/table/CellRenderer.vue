<script setup lang="ts">
import { computed } from 'vue';
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

const { column, row } = defineProps<{
  column: ColumnConfig;
  row: Record<string, any>;
}>();

const value = computed(() => row[column.key]);
</script>

<template>
  <ProductLink v-if="column.type === 'product-link'" :code="String(row.code)" :label="String(value ?? row.code)" />
  <template v-else-if="column.type === 'simple-text'">{{ value ?? '' }}</template>
  <TruncatedText v-else-if="column.type === 'truncated-text'" :value="value" />
  <ProgressBar v-else-if="column.type === 'progress-bar'" :value="value ?? 0" />
  <GradeBadge v-else-if="column.type === 'grade-badge'" :grade="value" />
  <NovaDots v-else-if="column.type === 'nova-dots'" :rating="value" />
  <LargeCounter v-else-if="column.type === 'large-counter'" :value="value" />
  <DecimalUnits v-else-if="column.type === 'decimal-units' && column.unit" :value="value" :unit="column.unit" />
  <AbsoluteDate v-else-if="column.type === 'absolute-date'" :value="value" />
  <RelativeDate v-else-if="column.type === 'relative-date'" :value="value" />
  <TimeFormat v-else-if="column.type === 'time-format'" :value="value" />
  <BooleanYesNo v-else-if="column.type === 'boolean-yesno'" :value="value" />
  <ProductImage v-else-if="column.type === 'product-image'" :value="value" />
  <StarRating v-else-if="column.type === 'star-rating'" :value="value" />
  <ColorPill v-else-if="column.type === 'color-pill'" :value="value" />
  <template v-else>{{ value ?? '' }}</template>
</template>
