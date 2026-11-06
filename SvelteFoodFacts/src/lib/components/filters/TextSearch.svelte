<script lang="ts">
  import './TextSearch.css';

  let {
    value = $bindable(),
    placeholder = 'Search',
    oncommit,
  }: {
    value: string;
    placeholder?: string;
    oncommit?: () => void;
  } = $props();

  function handleInput(event: Event) {
    value = (event.target as HTMLInputElement).value;
  }

  // Commits on blur and on Enter.
  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      oncommit?.();
    }
  }
</script>

<input
  type="text"
  class="text-search-input"
  {placeholder}
  {value}
  oninput={handleInput}
  onblur={() => oncommit?.()}
  onkeyup={handleKeyUp}
/>
