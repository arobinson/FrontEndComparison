<script setup lang="ts">
import './Button.css';

const {
  type = 'button',
  disabled = false,
  variant = 'secondary',
  size = 'md',
} = defineProps<{
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
}>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <button :class="`aff-button variant-${variant} size-${size}`" :type="type" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>
