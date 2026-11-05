<script setup lang="ts">
import { computed } from 'vue';
import './ProgressBar.css';

const { value } = defineProps<{
  value: number;
}>();

const percentage = computed(() => {
  let result: number;
  if (value < 0) {
    result = 0;
  } else if (value > 100) {
    result = 100;
  } else {
    result = value;
  }
  return result;
});

const colorClass = computed(() => {
  let result: string;
  if (percentage.value >= 70) {
    result = 'high';
  } else if (percentage.value >= 40) {
    result = 'medium';
  } else {
    result = 'low';
  }
  return result;
});
</script>

<template>
  <div class="progress-bar-container">
    <div :class="`progress-bar ${colorClass}`">
      <div class="progress-fill" :style="{ width: `${percentage}%` }"></div>
    </div>
    <span class="progress-text">{{ percentage }}%</span>
  </div>
</template>
