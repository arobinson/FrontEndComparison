<script setup lang="ts">
import './RangeSlider.css';

interface Range {
  min?: number;
  max?: number;
}

const { min = 0, max = 100 } = defineProps<{
  /** Bounds for the inputs' min/max attributes */
  min?: number;
  max?: number;
}>();

// Controlled: the parent owns the value (v-model); the control only reports edits and commits
const value = defineModel<Range>({ required: true });

const emit = defineEmits<{
  /** Fired on blur of either input */
  commit: [];
}>();

const toNumber = (event: Event): number | undefined => {
  const raw = (event.target as HTMLInputElement).value;
  return raw === '' ? undefined : Number(raw);
};

// The new value only contains the bounds that are set (an empty input means the bound is absent)
const withBound = (bound: keyof Range, next: number | undefined): Range => {
  const result: Range = { ...value.value };
  if (next === undefined) {
    delete result[bound];
  } else {
    result[bound] = next;
  }
  return result;
};

const handleMinChange = (event: Event) => {
  value.value = withBound('min', toNumber(event));
};

const handleMaxChange = (event: Event) => {
  value.value = withBound('max', toNumber(event));
};

const handleBlur = () => {
  emit('commit');
};
</script>

<template>
  <div class="range-slider">
    <input
      type="number"
      class="range-input"
      :min="min"
      :max="max"
      :value="value.min ?? ''"
      placeholder="Min"
      @input="handleMinChange"
      @blur="handleBlur"
    />
    <span class="range-separator">-</span>
    <input
      type="number"
      class="range-input"
      :min="min"
      :max="max"
      :value="value.max ?? ''"
      placeholder="Max"
      @input="handleMaxChange"
      @blur="handleBlur"
    />
  </div>
</template>
