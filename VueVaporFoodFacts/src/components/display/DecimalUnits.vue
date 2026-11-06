<script setup lang="ts">
import { computed } from 'vue';
import './DecimalUnits.css';

// Regex to extract currency symbol and numeric value
const CURRENCY_REGEX = /^([£$€¥₹])?([0-9,.-]+)([£$€¥₹])?$/;
const SYMBOL_TO_CURRENCY: Record<string, string> = {
  $: 'USD',
  '£': 'GBP',
  '€': 'EUR',
  '¥': 'JPY',
  '₹': 'INR',
};

const {
  value,
  unit = '',
  decimals = 2,
  currencyCode,
} = defineProps<{
  value: number | string | null | undefined;
  unit?: string;
  decimals?: number;
  currencyCode?: string;
}>();

const formattedValue = computed(() => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  let num: number;
  let detectedCurrency: string | undefined;

  if (typeof value === 'number') {
    num = value;
  } else {
    const match = value.trim().match(CURRENCY_REGEX);
    if (match) {
      const symbol = match[1] || match[3];
      if (symbol) {
        detectedCurrency = SYMBOL_TO_CURRENCY[symbol];
      }
      const cleaned = match[2].replace(/,/g, '');
      num = parseFloat(cleaned);
    } else {
      const cleaned = value.replace(/[^0-9.-]/g, '');
      num = parseFloat(cleaned);
    }
  }

  if (isNaN(num)) {
    return '';
  }

  const currency = currencyCode || detectedCurrency;
  if (currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  }

  return num.toFixed(decimals);
});
</script>

<template>
  <span class="decimal-units">{{ formattedValue }}<span v-if="unit" class="unit">{{ unit }}</span></span>
</template>
