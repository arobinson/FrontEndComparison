<script lang="ts">
  import { resolve } from '$app/paths';

  let { value }: { value: string | number } = $props();

  let href = $derived(resolve('/detail/[code]', { code: String(value) }));
</script>

<a {href} class="product-link">{value}</a>

<style>
  .product-link {
    color: #0066cc;
    text-decoration: none;
    font-weight: 500;
  }

  .product-link:hover {
    color: #004499;
  }

  .product-link:visited {
    color: #551a8b;
  }
</style>
