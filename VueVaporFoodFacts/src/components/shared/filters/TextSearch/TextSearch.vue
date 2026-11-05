<script setup vapor lang="ts">
import { ref, watch } from 'vue';
import './TextSearch.css';

const { placeholder = 'Search', resetTrigger = 0 } = defineProps<{
  placeholder?: string;
  resetTrigger?: number;
}>();

const emit = defineEmits<{
  valueChange: [value: string];
}>();

const searchValue = ref('');

watch(
  () => resetTrigger,
  () => {
    searchValue.value = '';
  }
);

const handleInput = (event: Event) => {
  searchValue.value = (event.target as HTMLInputElement).value;
};

const commit = () => {
  emit('valueChange', searchValue.value);
};
</script>

<template>
  <input
    type="text"
    class="text-search-input"
    :placeholder="placeholder"
    :value="searchValue"
    @input="handleInput"
    @blur="commit"
    @keyup.enter="commit"
  />
</template>
