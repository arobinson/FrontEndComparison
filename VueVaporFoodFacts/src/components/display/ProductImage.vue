<script setup lang="ts">
import { ref } from 'vue';
import './ProductImage.css';

const { value, size = 'small' } = defineProps<{
  value: string | undefined;
  size?: 'small' | 'large';
}>();

const imageLoaded = ref(false);
const imageError = ref(false);

const onImageLoad = () => {
  imageLoaded.value = true;
};

const onImageError = () => {
  imageError.value = true;
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
