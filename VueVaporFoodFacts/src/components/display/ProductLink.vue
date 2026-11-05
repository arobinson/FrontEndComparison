<script setup vapor lang="ts">
import { RouterLink } from 'vue-router';
import './ProductLink.css';

defineProps<{
  code: string;
  label: string;
}>();
</script>

<template>
  <RouterLink :to="`/detail/${code}`" class="product-link">{{ label }}</RouterLink>
</template>
