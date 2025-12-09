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
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: #e5e7eb;
  }

  .dot.filled {
    background-color: #f97316;
  }
</style>
