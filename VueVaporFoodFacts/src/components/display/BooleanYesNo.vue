<script setup vapor lang="ts">
import './BooleanYesNo.css';

defineProps<{
  value: boolean | undefined;
}>();
</script>

<template>
  <span :class="`boolean-yesno ${value ? 'yes' : 'no'}`">{{ value ? 'Yes' : 'No' }}</span>
</template>
