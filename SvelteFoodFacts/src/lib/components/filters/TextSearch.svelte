<script lang="ts">
  let {
    placeholder = 'Search...',
    resetTrigger = 0,
    onValueChange,
  }: {
    placeholder?: string;
    resetTrigger?: number;
    onValueChange?: (value: string) => void;
  } = $props();

  let inputValue = $state('');

  // Reset when trigger changes
  $effect(() => {
    if (resetTrigger) {
      inputValue = '';
    }
  });

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    inputValue = target.value;
    onValueChange?.(inputValue);
  }
</script>

<input
  type="text"
  class="text-search"
  {placeholder}
  value={inputValue}
  oninput={handleInput}
/>

<style>
  .text-search {
    width: 100%;
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
  }

  .text-search:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
</style>
