<script lang="ts">
  import type { Snippet } from 'svelte';
  import FrameworkHeader from '$lib/components/shared/FrameworkHeader/FrameworkHeader.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<FrameworkHeader />
{@render children()}

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(html),
  :global(body) {
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.5;
    color: #333;
  }
</style>
