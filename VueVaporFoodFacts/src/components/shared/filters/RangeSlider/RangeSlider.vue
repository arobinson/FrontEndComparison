<script setup lang="ts">
import { computed } from 'vue';
import { useFilterStore, type RangeValue } from '../../../../composables/useFilterStore';
import './RangeSlider.css';

const {
  column,
  min = 0,
  max = 100,
} = defineProps<{
  column: string;
  min?: number;
  max?: number;
}>();

const store = useFilterStore();

const range = computed(() => store.getDraft<RangeValue>(column, {}));

const toNumber = (event: Event): number | undefined => {
  const raw = (event.target as HTMLInputElement).value;
  return raw === '' ? undefined : Number(raw);
};

const handleMinChange = (event: Event) => {
  store.setDraft(column, { ...range.value, min: toNumber(event) });
};

const handleMaxChange = (event: Event) => {
  store.setDraft(column, { ...range.value, max: toNumber(event) });
};

// Applies on blur of either input; the applied object only contains the bounds that are set
const handleBlur = () => {
  store.apply(column);
};
</script>

<template>
  <div class="range-slider">
    <input
      type="number"
      class="range-input"
      :min="min"
      :max="max"
      :value="range.min ?? ''"
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
      :value="range.max ?? ''"
      placeholder="Max"
      @input="handleMaxChange"
      @blur="handleBlur"
    />
  </div>
</template>
