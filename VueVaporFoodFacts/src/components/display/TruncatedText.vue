<script setup vapor lang="ts">
import { computed, ref } from 'vue';
import './TruncatedText.css';

const { value, maxLength = 50 } = defineProps<{
  value: string | null | undefined;
  maxLength?: number;
}>();

const isExpanded = ref(false);

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

const shouldTruncate = computed(() => (value ? value.length > maxLength : false));

const displayValue = computed(() => {
  let result: string;
  if (!value) {
    result = '';
  } else if (shouldTruncate.value && !isExpanded.value) {
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
    <button v-if="shouldTruncate" class="toggle-button" type="button" @click="toggleExpanded">{{ isExpanded ? 'Show less' : 'Show more' }}</button>
  </div>
</template>
