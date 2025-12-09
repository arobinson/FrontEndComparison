<script lang="ts">
  import { resolve } from '$app/paths';

  let { value }: { value: string | number } = $props();

  let href = $derived(resolve('/detail/[code]', { code: String(value) }));
</script>

<a {href} class="product-link">{value}</a>

<style>
  .product-link {
    color: #2563eb;
    text-decoration: none;
  }

  .product-link:hover {
    text-decoration: underline;
  }
</style>
