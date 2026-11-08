<script lang="ts">
  import Button from '#lib/components/controls/Button.svelte';
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

  // The dropdown is a native popover: the toggle button opens and closes it, and the browser
  // closes it on an outside click or Escape. The options only render while it is open.
  const dropdownId = $props.id();
  let isOpen = $state(false);

  let displayText = $derived(
    value.length === 0
      ? placeholder
      : value.length === 1
        ? value[0]
        : `${value.length} selected`
  );

  // Every toggle emits a new selection (insertion order).
  function toggleOption(option: string) {
    value = value.includes(option)
      ? value.filter((selected) => selected !== option)
      : [...value, option];
  }
</script>

<div class="multi-select">
  <Button size="sm" class="select-toggle" popoverTarget={dropdownId}>
    <span>{displayText}</span>
    <span class="arrow">▼</span>
  </Button>

  <div
    id={dropdownId}
    class="dropdown"
    popover="auto"
    onbeforetoggle={(event) => (isOpen = event.newState === 'open')}
  >
    {#if isOpen}
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
    {/if}
  </div>
</div>
