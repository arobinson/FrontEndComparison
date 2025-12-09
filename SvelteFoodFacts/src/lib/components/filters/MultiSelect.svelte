<script lang="ts">
  let {
    options = [],
    resetTrigger = 0,
    onValueChange,
  }: {
    options?: string[];
    resetTrigger?: number;
    onValueChange?: (value: string[]) => void;
  } = $props();

  let selected = $state<Set<string>>(new Set());
  let isOpen = $state(false);

  // Reset when trigger changes
  $effect(() => {
    if (resetTrigger) {
      selected = new Set();
    }
  });

  function toggleOption(option: string) {
    if (selected.has(option)) {
      selected.delete(option);
    } else {
      selected.add(option);
    }
    selected = new Set(selected); // Trigger reactivity
    onValueChange?.([...selected]);
  }

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  let displayText = $derived(
    selected.size === 0 ? 'All' : `${selected.size} selected`
  );
</script>

<div class="multi-select">
  <button type="button" class="select-button" onclick={toggleDropdown}>
    {displayText}
    <span class="arrow">{isOpen ? '▲' : '▼'}</span>
  </button>

  {#if isOpen}
    <div class="dropdown">
      {#each options as option (option)}
        <label class="option">
          <input
            type="checkbox"
            checked={selected.has(option)}
            onchange={() => toggleOption(option)}
          />
          {option}
        </label>
      {/each}
    </div>
  {/if}
</div>

<style>
  .multi-select {
    position: relative;
  }

  .select-button {
    width: 100%;
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    background: white;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .arrow {
    font-size: 0.625rem;
    color: #6b7280;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10;
    max-height: 150px;
    overflow-y: auto;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .option:hover {
    background-color: #f3f4f6;
  }
</style>
