<script lang="ts">
  import { getFilterStore } from '#lib/stores/filterStore.svelte';
  import './TextSearch.css';

  let {
    column,
    placeholder = 'Search',
  }: {
    column: string;
    placeholder?: string;
  } = $props();

  const store = getFilterStore();

  let searchValue = $derived((store.drafts[column] as string | undefined) ?? '');

  function handleInput(event: Event) {
    store.setDraft(column, (event.target as HTMLInputElement).value);
  }

  // Applies on blur and on Enter.
  function handleBlur() {
    store.apply(column);
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      store.apply(column);
    }
  }
</script>

<input
  type="text"
  class="text-search-input"
  {placeholder}
  value={searchValue}
  oninput={handleInput}
  onblur={handleBlur}
  onkeyup={handleKeyUp}
/>
