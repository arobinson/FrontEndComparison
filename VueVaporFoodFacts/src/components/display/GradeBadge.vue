<script setup vapor lang="ts">
import { computed } from 'vue';
import './GradeBadge.css';

const { grade } = defineProps<{
  grade: string | null | undefined;
}>();

const gradeClass = computed(() => {
  const gradeUpper = grade?.toUpperCase();
  let result: string;
  if (gradeUpper === 'A') {
    result = 'grade-a';
  } else if (gradeUpper === 'B') {
    result = 'grade-b';
  } else if (gradeUpper === 'C') {
    result = 'grade-c';
  } else if (gradeUpper === 'D') {
    result = 'grade-d';
  } else if (gradeUpper === 'F') {
    result = 'grade-f';
  } else {
    result = 'grade-unknown';
  }
  return result;
});
</script>

<template>
  <span :class="`grade-badge ${gradeClass}`">{{ ` ${grade} ` }}</span>
</template>
