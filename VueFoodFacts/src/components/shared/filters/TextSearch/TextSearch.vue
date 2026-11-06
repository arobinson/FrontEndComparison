<script setup lang="ts">
import './TextSearch.css';

const { placeholder = 'Search' } = defineProps<{
  placeholder?: string;
}>();

// Controlled: the parent owns the value (v-model); the control only reports edits and commits
const value = defineModel<string>({ required: true });

const emit = defineEmits<{
  /** Fired on blur and on Enter */
  commit: [];
}>();

const handleInput = (event: Event) => {
  value.value = (event.target as HTMLInputElement).value;
};

const commit = () => {
  emit('commit');
};
</script>

<template>
  <input
    type="text"
    class="text-search-input"
    :placeholder="placeholder"
    :value="value"
    @input="handleInput"
    @blur="commit"
    @keyup.enter="commit"
  />
</template>
