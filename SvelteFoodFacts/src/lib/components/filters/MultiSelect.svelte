<script lang="ts">
  import { getFilterStore } from '#lib/stores/filterStore.svelte';
  import './MultiSelect.css';

  let {
    column,
    options,
    placeholder = 'Select...',
  }: {
    column: string;
    options: string[];
    placeholder?: string;
  } = $props();

  const store = getFilterStore();

  let selectedValues = $derived((store.drafts[column] as string[] | undefined) ?? []);
  let isOpen = $state(false);
  let container: HTMLDivElement | undefined = $state();

  let displayText = $derived(
    selectedValues.length === 0
      ? placeholder
      : selectedValues.length === 1
        ? selectedValues[0]
        : `${selectedValues.length} selected`
  );

  // Click outside closes the dropdown (the toggle's own click lands inside the container).
  function handleDocumentClick(event: MouseEvent) {
    if (isOpen && container && !container.contains(event.target as Node)) {
      isOpen = false;
    }
  }

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  // Every toggle updates the selection and applies it immediately.
  function toggleOption(option: string) {
    const next = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];
    store.setDraft(column, next);
    store.apply(column);
  }
</script>

<svelte:document onclick={handleDocumentClick} />

<div class="multi-select" bind:this={container}>
  <button class="select-toggle" onclick={toggleDropdown} type="button">
    <span>{displayText}</span>
    <span class="arrow">▼</span>
  </button>

  {#if isOpen}
    <div class="dropdown">
      {#each options as option (option)}
        <label class="option">
          <input
            type="checkbox"
            checked={selectedValues.includes(option)}
            onchange={() => toggleOption(option)}
          />
          <span>{option}</span>
        </label>
      {/each}
    </div>
  {/if}
</div>
