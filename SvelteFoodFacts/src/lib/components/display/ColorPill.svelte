<script lang="ts">
  let { value }: { value: string } = $props();
</script>

<span
  class="color-pill"
  style:background-color={value}
  title={value}
></span>

<style>
  .color-pill {
    display: inline-block;
    width: 1.5rem;
    height: 1rem;
    border-radius: 0.25rem;
    border: 1px solid #e5e7eb;
  }
</style>
