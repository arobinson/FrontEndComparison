<script lang="ts">
  import './RangeSlider.css';

  type Range = { min?: number; max?: number };

  let {
    value = $bindable(),
    min = 0,
    max = 100,
    oncommit,
  }: {
    value: Range;
    min?: number;
    max?: number;
    oncommit?: () => void;
  } = $props();

  function parseInput(event: Event): number | undefined {
    const input = (event.target as HTMLInputElement).value;
    return input === '' ? undefined : Number(input);
  }

  // Only bounds that are set end up in the range object.
  function toRange(minBound: number | undefined, maxBound: number | undefined): Range {
    const result: Range = {};
    if (minBound !== undefined) {
      result.min = minBound;
    }
    if (maxBound !== undefined) {
      result.max = maxBound;
    }
    return result;
  }

  function handleMinChange(event: Event) {
    value = toRange(parseInput(event), value.max);
  }

  function handleMaxChange(event: Event) {
    value = toRange(value.min, parseInput(event));
  }

  // Commits on blur of either input (onblur in the markup).
</script>

<div class="range-slider">
  <input
    type="number"
    class="range-input"
    {min}
    {max}
    value={value.min ?? ''}
    oninput={handleMinChange}
    onblur={() => oncommit?.()}
    placeholder="Min"
  />
  <span class="range-separator">-</span>
  <input
    type="number"
    class="range-input"
    {min}
    {max}
    value={value.max ?? ''}
    oninput={handleMaxChange}
    onblur={() => oncommit?.()}
    placeholder="Max"
  />
</div>
