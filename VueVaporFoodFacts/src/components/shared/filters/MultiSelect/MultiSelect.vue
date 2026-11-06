<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import { Button } from '../../Button';
import './MultiSelect.css';

const { options, placeholder = 'Select...' } = defineProps<{
  options: string[];
  placeholder?: string;
}>();

// Controlled: the parent owns the selection (v-model); only the open/closed state is local
const selectedValues = defineModel<string[]>({ required: true });
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

// Reports a new array (insertion order) on every toggle
const toggleOption = (option: string) => {
  const current = selectedValues.value;
  selectedValues.value = current.includes(option) ? current.filter((value) => value !== option) : [...current, option];
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
    <Button size="sm" class="select-toggle" @click="toggleDropdown"
      ><span>{{ displayText }}</span><span class="arrow">▼</span></Button
    >

    <div v-if="isOpen" class="dropdown">
      <label v-for="option in options" :key="option" class="option">
        <input type="checkbox" :checked="selectedValues.includes(option)" @change="toggleOption(option)" />
        <span>{{ option }}</span>
      </label>
    </div>
  </div>
</template>
