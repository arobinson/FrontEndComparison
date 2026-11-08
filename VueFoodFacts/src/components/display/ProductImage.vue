<script setup lang="ts">
import { computed, ref } from 'vue';
import './ProductImage.css';

const { value, size = 'small' } = defineProps<{
  value: string | undefined;
  size?: 'small' | 'large';
}>();

// Load/error state belongs to the URL it happened for, so a new URL starts out not loaded
const loadedSrc = ref<string | null>(null);
const failedSrc = ref<string | null>(null);
const imageLoaded = computed(() => loadedSrc.value === value);
const imageError = computed(() => failedSrc.value === value);

const onImageLoad = () => {
  loadedSrc.value = value ?? null;
};

const onImageError = () => {
  failedSrc.value = value ?? null;
};
</script>

<template>
  <div :class="`product-image ${size}`">
    <img
      v-if="!imageError"
      :src="value"
      alt="Product image"
      :class="imageLoaded ? 'loaded' : ''"
      @load="onImageLoad"
      @error="onImageError"
    />
    <div v-else class="image-placeholder">No image</div>
  </div>
</template>
