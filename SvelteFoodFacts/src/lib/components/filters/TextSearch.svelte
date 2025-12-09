<script lang="ts">
  let {
    placeholder = 'Search',
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
    padding: 0.25rem 0.375rem;
    font-size: 0.8125rem;
    font-family: inherit;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .text-search:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }

  .text-search::placeholder {
    color: #999;
  }
</style>
