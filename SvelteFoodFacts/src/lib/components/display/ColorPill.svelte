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
    width: 24px;
    height: 24px;
    border-radius: 12px;
    border: 1px solid #ddd;
    cursor: help;
  }
</style>
