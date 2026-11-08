<script lang="ts">
  let { value, size = 'small' }: { value: string; size?: 'small' | 'large' } = $props();

  // Load/error state belongs to the URL it happened for, so a new URL starts out not loaded
  let loadedSrc = $state<string | null>(null);
  let failedSrc = $state<string | null>(null);
  const imageLoaded = $derived(loadedSrc === value);
  const imageError = $derived(failedSrc === value);

  function onImageLoad() {
    loadedSrc = value;
  }

  function onImageError() {
    failedSrc = value;
  }
</script>

<div class="product-image {size}">
  {#if !imageError}
    <img
      src={value}
      alt="Product image"
      class:loaded={imageLoaded}
      onload={onImageLoad}
      onerror={onImageError}
    />
  {:else}
    <div class="image-placeholder">No image</div>
  {/if}
</div>

<style>
  .product-image {
    display: inline-block;
  }

  .product-image img {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .product-image img.loaded {
    opacity: 1;
  }

  .product-image.small img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
  }

  .product-image.large img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
  }

  .image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    color: #999;
    font-size: 12px;
  }

  .small .image-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }

  .large .image-placeholder {
    width: 200px;
    height: 200px;
    border-radius: 8px;
  }
</style>
