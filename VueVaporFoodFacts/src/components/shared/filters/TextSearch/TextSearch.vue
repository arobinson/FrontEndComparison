<script setup lang="ts">
import { computed } from 'vue';
import { useFilterStore } from '../../../../composables/useFilterStore';
import './TextSearch.css';

const { column, placeholder = 'Search' } = defineProps<{
  column: string;
  placeholder?: string;
}>();

const store = useFilterStore();

const searchValue = computed(() => store.getDraft(column, ''));

const handleInput = (event: Event) => {
  store.setDraft(column, (event.target as HTMLInputElement).value);
};

const commit = () => {
  store.apply(column);
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
