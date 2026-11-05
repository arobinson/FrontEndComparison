<script setup vapor lang="ts">
import { computed } from 'vue';
import './StarRating.css';

const { value, maxStars = 5 } = defineProps<{
  value: number | null | undefined;
  maxStars?: number;
}>();

const stars = computed(() => {
  const rating = value ?? 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return {
    full: Array(fullStars).fill(0),
    half: hasHalfStar ? [0] : [],
    empty: Array(emptyStars).fill(0),
  };
});
</script>

<template>
  <div class="star-rating">
    <span v-for="(_, i) in stars.full" :key="`full-${i}`" class="star full">★</span>
    <span v-for="(_, i) in stars.half" :key="`half-${i}`" class="star half">★</span>
    <span v-for="(_, i) in stars.empty" :key="`empty-${i}`" class="star empty">☆</span>
    <span class="rating-value">{{ value }}</span>
  </div>
</template>
