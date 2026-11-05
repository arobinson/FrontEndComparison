<script setup lang="ts">
import { ref, watch } from 'vue';
import './RangeSlider.css';

interface RangeValue {
  min?: number;
  max?: number;
}

const { min = 0, max = 100, resetTrigger = 0 } = defineProps<{
  min?: number;
  max?: number;
  resetTrigger?: number;
}>();

const emit = defineEmits<{
  valueChange: [value: RangeValue];
}>();

const minValue = ref<number | undefined>(undefined);
const maxValue = ref<number | undefined>(undefined);

watch(
  () => resetTrigger,
  () => {
    minValue.value = undefined;
    maxValue.value = undefined;
  }
);

const toNumber = (event: Event): number | undefined => {
  const raw = (event.target as HTMLInputElement).value;
  return raw === '' ? undefined : Number(raw);
};

const handleMinChange = (event: Event) => {
  minValue.value = toNumber(event);
};

const handleMaxChange = (event: Event) => {
  maxValue.value = toNumber(event);
};

const handleBlur = () => {
  const result: RangeValue = {};
  if (minValue.value !== undefined) {
    result.min = minValue.value;
  }
  if (maxValue.value !== undefined) {
    result.max = maxValue.value;
  }
  emit('valueChange', result);
};
</script>

<template>
  <div class="range-slider">
    <input
      type="number"
      class="range-input"
      :min="min"
      :max="max"
      :value="minValue ?? ''"
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
      :value="maxValue ?? ''"
      placeholder="Max"
      @input="handleMaxChange"
      @blur="handleBlur"
    />
  </div>
</template>
