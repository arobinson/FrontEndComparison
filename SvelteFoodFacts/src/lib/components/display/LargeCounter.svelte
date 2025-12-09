<script lang="ts">
  let { value }: { value: number | undefined } = $props();

  let formattedValue = $derived(() => {
    if (value === undefined || value === null) {
      return '0';
    }
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + 'M';
    }
    if (value >= 1_000) {
      return value.toLocaleString('en-US');
    }
    return value.toString();
  });
</script>

<span class="large-counter">{formattedValue()}</span>

<style>
  .large-counter {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
</style>
