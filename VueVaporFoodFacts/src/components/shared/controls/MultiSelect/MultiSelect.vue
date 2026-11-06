<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { Button } from '../../Button';
import './MultiSelect.css';

const { options, placeholder = 'Select...' } = defineProps<{
  options: string[];
  placeholder?: string;
}>();

// Controlled: the parent owns the selection (v-model); only the open/closed state is local.
// The dropdown is a native popover: the toggle button opens and closes it, and the browser
// closes it on an outside click or Escape. The options only render while it is open.
const selectedValues = defineModel<string[]>({ required: true });
const isOpen = ref(false);
const dropdownId = useId();

const onBeforeToggle = (event: ToggleEvent) => {
  isOpen.value = event.newState === 'open';
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
  <div class="multi-select">
    <Button size="sm" class="select-toggle" :popover-target="dropdownId"
      ><span>{{ displayText }}</span><span class="arrow">▼</span></Button
    >

    <div :id="dropdownId" class="dropdown" popover="auto" @beforetoggle="onBeforeToggle">
      <template v-if="isOpen">
        <label v-for="option in options" :key="option" class="option">
          <input type="checkbox" :checked="selectedValues.includes(option)" @change="toggleOption(option)" />
          <span>{{ option }}</span>
        </label>
      </template>
    </div>
  </div>
</template>
