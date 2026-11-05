<script setup vapor lang="ts">
import { computed } from 'vue';
import './LargeCounter.css';

const { value } = defineProps<{
  value: number | null | undefined;
}>();

const formattedValue = computed(() => {
  let result: string;
  if (value === null || value === undefined) {
    result = '0';
  } else if (value >= 1000000) {
    result = (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    result = value.toLocaleString('en-US');
  } else {
    result = value.toString();
  }
  return result;
});
</script>

<template>
  <span class="large-counter">{{ formattedValue }}</span>
</template>
