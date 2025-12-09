<script lang="ts">
  let {
    min = 0,
    max = 100,
    resetTrigger = 0,
    onValueChange,
  }: {
    min?: number;
    max?: number;
    resetTrigger?: number;
    onValueChange?: (value: { min: number; max: number }) => void;
  } = $props();

  let minValue = $state(min);
  let maxValue = $state(max);

  // Reset when trigger changes
  $effect(() => {
    if (resetTrigger) {
      minValue = min;
      maxValue = max;
    }
  });

  function handleMinChange(event: Event) {
    const target = event.target as HTMLInputElement;
    minValue = Number(target.value);
    if (minValue > maxValue) minValue = maxValue;
    onValueChange?.({ min: minValue, max: maxValue });
  }

  function handleMaxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    maxValue = Number(target.value);
    if (maxValue < minValue) maxValue = minValue;
    onValueChange?.({ min: minValue, max: maxValue });
  }
</script>

<div class="range-slider">
  <input
    type="number"
    class="range-input"
    value={minValue}
    {min}
    max={maxValue}
    oninput={handleMinChange}
  />
  <span class="separator">-</span>
  <input
    type="number"
    class="range-input"
    value={maxValue}
    min={minValue}
    {max}
    oninput={handleMaxChange}
  />
</div>

<style>
  .range-slider {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .range-input {
    width: 60px;
    padding: 0.25rem;
    font-size: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    text-align: center;
  }

  .range-input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .separator {
    color: #6b7280;
  }
</style>
