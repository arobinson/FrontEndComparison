<script lang="ts">
  import Button from '#lib/components/shared/Button/Button.svelte';
  import './MultiSelect.css';

  let {
    options,
    value = $bindable(),
    placeholder = 'Select...',
  }: {
    options: string[];
    value: string[];
    placeholder?: string;
  } = $props();

  let isOpen = $state(false);
  let container: HTMLDivElement | undefined = $state();

  let displayText = $derived(
    value.length === 0
      ? placeholder
      : value.length === 1
        ? value[0]
        : `${value.length} selected`
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

  // Every toggle emits a new selection (insertion order).
  function toggleOption(option: string) {
    value = value.includes(option)
      ? value.filter((selected) => selected !== option)
      : [...value, option];
  }
</script>

<svelte:document onclick={handleDocumentClick} />

<div class="multi-select" bind:this={container}>
  <Button size="sm" class="select-toggle" onclick={toggleDropdown}>
    <span>{displayText}</span>
    <span class="arrow">▼</span>
  </Button>

  {#if isOpen}
    <div class="dropdown">
      {#each options as option (option)}
        <label class="option">
          <input
            type="checkbox"
            checked={value.includes(option)}
            onchange={() => toggleOption(option)}
          />
          <span>{option}</span>
        </label>
      {/each}
    </div>
  {/if}
</div>
