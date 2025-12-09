<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { onMount } from 'svelte';

  onMount(() => {
    goto(resolve('/list'), { replaceState: true });
  });
</script>

<p>Redirecting to product list...</p>
