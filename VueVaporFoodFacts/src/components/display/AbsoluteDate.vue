<script setup vapor lang="ts">
import { computed } from 'vue';

const { value } = defineProps<{
  value: Date | string | null | undefined;
}>();

const formattedDate = computed(() => {
  let result: string;
  if (!value) {
    result = '';
  } else {
    const date = new Date(value);
    result = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  return result;
});
</script>

<template>
  <span class="absolute-date">{{ formattedDate }}</span>
</template>
