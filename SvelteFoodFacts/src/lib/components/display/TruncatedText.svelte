<script lang="ts">
  import Button from '#lib/components/controls/Button.svelte';

  // Controlled: the parent owns the expanded state and binds it with bind:expanded
  let {
    value,
    maxLength = 50,
    expanded = $bindable(false),
  }: { value: string; maxLength?: number; expanded?: boolean } = $props();

  let shouldTruncate = $derived((value?.length ?? 0) > maxLength);

  let displayText = $derived.by(() => {
    const text = value || '';
    if (shouldTruncate && !expanded) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
  });

  function toggleExpanded() {
    expanded = !expanded;
  }
</script>

<div class="truncated-text">
  <span class="text-content">{displayText}</span>
  {#if shouldTruncate}
    <Button variant="tertiary" size="sm" class="toggle-button" onclick={toggleExpanded}>
      {expanded ? 'Show less' : 'Show more'}
    </Button>
  {/if}
</div>

<style>
  .truncated-text {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .text-content {
    flex: 1;
    word-break: break-word;
  }

  .truncated-text :global(.toggle-button) {
    background: none;
    border: none;
    color: #0066cc;
    cursor: pointer;
    font-size: 12px;
    padding: 2px 6px;
    text-decoration: underline;
    white-space: nowrap;
  }

  .truncated-text :global(.toggle-button:hover) {
    color: #004499;
  }

  .truncated-text :global(.toggle-button:focus) {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }
</style>
