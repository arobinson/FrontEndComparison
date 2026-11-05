<script setup lang="ts">
import { computed } from 'vue';

const { value } = defineProps<{
  value: string | null | undefined;
}>();

const formatted = computed(() => {
  let result: string;
  if (!value) {
    result = '';
  } else {
    const [hours, minutes] = value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    result = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }
  return result;
});
</script>

<template>{{ formatted }}</template>
