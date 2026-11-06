<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import { useFilterStore } from '../../../../composables/useFilterStore';
import './MultiSelect.css';

const {
  column,
  options,
  placeholder = 'Select...',
} = defineProps<{
  column: string;
  options: string[];
  placeholder?: string;
}>();

const store = useFilterStore();

const selectedValues = computed(() => store.getDraft<string[]>(column, []));
const isOpen = ref(false);
const container = useTemplateRef<HTMLDivElement>('container');
let lastClickWhenOpened: EventTarget | null = null;

const handleClickOutside = (event: MouseEvent) => {
  if (!isOpen.value) return;
  if (event.target === lastClickWhenOpened) return;

  if (container.value && !container.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

// Real DOM side effect: a document-level click-outside listener, added on mount and removed on unmount
onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

const toggleDropdown = (event: MouseEvent) => {
  const willBeOpen = !isOpen.value;
  if (willBeOpen) {
    lastClickWhenOpened = event.target;
  }
  isOpen.value = willBeOpen;
};

// Applies on every toggle
const toggleOption = (option: string) => {
  const current = selectedValues.value;
  const next = current.includes(option) ? current.filter((value) => value !== option) : [...current, option];
  store.setDraft(column, next);
  store.apply(column);
};

const displayText = computed(() => {
  const count = selectedValues.value.length;
  if (count === 0) {
    return placeholder;
  } else if (count === 1) {
    return selectedValues.value[0];
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
        <input type="checkbox" :checked="selectedValues.includes(option)" @change="toggleOption(option)" />
        <span>{{ option }}</span>
      </label>
    </div>
  </div>
</template>
