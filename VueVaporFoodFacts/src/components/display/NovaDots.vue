<script setup vapor lang="ts">
import { computed } from 'vue';
import './NovaDots.css';

const { rating } = defineProps<{
  rating: number | null | undefined;
}>();

const filledCount = computed(() => {
  let result: number;
  if (!rating || rating < 1) {
    result = 1;
  } else if (rating > 4) {
    result = 4;
  } else {
    result = Math.floor(rating);
  }
  return result;
});
</script>

<template>
  <div class="nova-dots">
    <span v-for="i in 4" :key="i" :class="i <= filledCount ? 'dot filled' : 'dot'"></span>
  </div>
</template>
