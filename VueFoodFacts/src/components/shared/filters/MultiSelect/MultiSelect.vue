<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import './MultiSelect.css';

const {
  options,
  placeholder = 'Select...',
  resetTrigger = 0,
} = defineProps<{
  options: string[];
  placeholder?: string;
  resetTrigger?: number;
}>();

const emit = defineEmits<{
  valueChange: [values: string[]];
}>();

// Replaced (never mutated) on every toggle, so a shallowRef is enough
const selectedValues = shallowRef<Set<string>>(new Set());
const isOpen = ref(false);
const container = useTemplateRef<HTMLDivElement>('container');
let lastClickWhenOpened: EventTarget | null = null;

watch(
  () => resetTrigger,
  () => {
    selectedValues.value = new Set();
  }
);

const handleClickOutside = (event: MouseEvent) => {
  if (!isOpen.value) return;
  if (event.target === lastClickWhenOpened) return;

  if (container.value && !container.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

const toggleDropdown = (event: MouseEvent) => {
  const willBeOpen = !isOpen.value;
  if (willBeOpen) {
    lastClickWhenOpened = event.target;
  }
  isOpen.value = willBeOpen;
};

const toggleOption = (option: string) => {
  const newSet = new Set(selectedValues.value);
  if (newSet.has(option)) {
    newSet.delete(option);
  } else {
    newSet.add(option);
  }
  selectedValues.value = newSet;
  emit('valueChange', Array.from(newSet));
};

const displayText = computed(() => {
  const count = selectedValues.value.size;
  if (count === 0) {
    return placeholder;
  } else if (count === 1) {
    return Array.from(selectedValues.value)[0];
  } else {
    return `${count} selected`;
  }
});
</script>

<template>
  <div ref="container" class="multi-select">
    <button class="select-toggle" type="button" @click="toggleDropdown">
      <span>{{ displayText }}</span>
      <span class="arrow">▼</span>
    </button>

    <div v-if="isOpen" class="dropdown">
      <label v-for="option in options" :key="option" class="option">
        <input type="checkbox" :checked="selectedValues.has(option)" @change="toggleOption(option)" />
        <span>{{ option }}</span>
      </label>
    </div>
  </div>
</template>
