<script lang="ts">
  let { value, maxLength = 50 }: { value: string; maxLength?: number } = $props();

  let isExpanded = $state(false);

  let shouldTruncate = $derived((value?.length ?? 0) > maxLength);

  let displayText = $derived(() => {
    const text = value || '';
    if (shouldTruncate && !isExpanded) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
  });

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }
</script>

<div class="truncated-text">
  <span class="text-content">{displayText()}</span>
  {#if shouldTruncate}
    <button class="toggle-button" onclick={toggleExpanded} type="button">
      {isExpanded ? 'Show less' : 'Show more'}
    </button>
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

  .toggle-button {
    background: none;
    border: none;
    color: #0066cc;
    cursor: pointer;
    font-size: 12px;
    padding: 2px 6px;
    text-decoration: underline;
    white-space: nowrap;
  }

  .toggle-button:hover {
    color: #004499;
  }

  .toggle-button:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }
</style>
