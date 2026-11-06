<script setup lang="ts">
import { computed } from 'vue';
import './Button.css';

const {
  type = 'button',
  disabled = false,
  variant = 'secondary',
  size = 'md',
  class: extraClass,
} = defineProps<{
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const classes = computed(() => {
  const base = `aff-button variant-${variant} size-${size}`;
  return extraClass ? `${base} ${extraClass}` : base;
});

const handleClick = (event: MouseEvent) => {
  if (!disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <button :class="classes" :type="type" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>
