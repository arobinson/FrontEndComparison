<script lang="ts">
  let { value }: { value: number } = $props();

  let rating = $derived(() => {
    if (value < 1) return 1;
    if (value > 4) return 4;
    return Math.floor(value);
  });

  let dots = $derived(() => {
    const filledCount = rating();
    const result = [];
    for (let i = 1; i <= 4; i++) {
      result.push({ filled: i <= filledCount });
    }
    return result;
  });
</script>

<div class="nova-dots">
  {#each dots() as dot, i (i)}
    <span class="dot" class:filled={dot.filled}></span>
  {/each}
</div>

<style>
  .nova-dots {
    display: inline-flex;
    gap: 4px;
    align-items: center;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #0066cc;
    background-color: transparent;
    transition: background-color 0.2s ease;
  }

  .dot.filled {
    background-color: #0066cc;
  }

  .dot:hover {
    transform: scale(1.1);
  }
</style>
