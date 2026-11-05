<script setup vapor lang="ts">
import './ColorPill.css';

defineProps<{
  value: string | undefined;
}>();
</script>

<template>
  <span class="color-pill" :style="{ backgroundColor: value }" :title="value"></span>
</template>
