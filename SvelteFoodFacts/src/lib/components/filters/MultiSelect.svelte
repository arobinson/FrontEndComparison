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
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }

  .select-button:hover {
    border-color: #0066cc;
  }

  .arrow {
    font-size: 10px;
    color: #999;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 2px;
    max-height: 200px;
    overflow-y: auto;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    cursor: pointer;
    font-size: 13px;
  }

  .option:hover {
    background-color: #f5f5f5;
  }

  .option input[type="checkbox"] {
    cursor: pointer;
  }
</style>
