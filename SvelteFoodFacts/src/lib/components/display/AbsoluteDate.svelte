<script lang="ts">
  let { value }: { value: string } = $props();

  let formattedDate = $derived.by(() => {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });
</script>

<span class="absolute-date">{formattedDate}</span>

<style>
  .absolute-date {
    color: #333;
  }
</style>
