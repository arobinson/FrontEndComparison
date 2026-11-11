<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '../controls/Button';
import './TruncatedText.css';

const { value, maxLength = 50 } = defineProps<{
  value: string | null | undefined;
  maxLength?: number;
}>();

// Controlled: the parent owns the expanded state and binds it with v-model:expanded
const expanded = defineModel<boolean>('expanded', { default: false });

const toggleExpanded = () => {
  expanded.value = !expanded.value;
};

const shouldTruncate = computed(() => (value ? value.length > maxLength : false));

const displayValue = computed(() => {
  let result: string;
  if (!value) {
    result = '';
  } else if (shouldTruncate.value && !expanded.value) {
    result = value.substring(0, maxLength - 3) + '...';
  } else {
    result = value;
  }
  return result;
});
</script>

<template>
  <div class="truncated-text">
    <span class="text-content">{{ displayValue }}</span>
    <Button v-if="shouldTruncate" variant="tertiary" size="sm" class="toggle-button" @click="toggleExpanded">{{
      expanded ? 'Show less' : 'Show more'
    }}</Button>
  </div>
</template>
