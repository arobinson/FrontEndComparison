<script lang="ts">
  let { value }: { value: boolean | null | undefined } = $props();
</script>

{#if value}
  <span class="yes">Yes</span>
{:else}
  <span class="no">No</span>
{/if}

<style>
  .yes {
    color: #22c55e;
    font-weight: 500;
  }

  .no {
    color: #ef4444;
    font-weight: 500;
  }
</style>
