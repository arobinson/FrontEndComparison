<script lang="ts">
  let { value }: { value: boolean | null | undefined } = $props();
</script>

{#if value}
  <span class="boolean-yesno yes">Yes</span>
{:else}
  <span class="boolean-yesno no">No</span>
{/if}

<style>
  .boolean-yesno {
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .yes {
    color: #4caf50;
    background-color: #e8f5e9;
  }

  .no {
    color: #666;
    background-color: #f5f5f5;
  }
</style>
