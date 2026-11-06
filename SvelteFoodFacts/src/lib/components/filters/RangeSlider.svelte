<script lang="ts">
  import { getFilterStore, type RangeFilterValue } from '#lib/stores/filterStore.svelte';
  import './RangeSlider.css';

  let {
    column,
    min = 0,
    max = 100,
  }: {
    column: string;
    min?: number;
    max?: number;
  } = $props();

  const store = getFilterStore();

  let draft = $derived(store.drafts[column] as RangeFilterValue | undefined);
  let minValue = $derived(draft?.min);
  let maxValue = $derived(draft?.max);

  function parseInput(event: Event): number | undefined {
    const value = (event.target as HTMLInputElement).value;
    return value === '' ? undefined : Number(value);
  }

  // Only bounds that are set end up in the (applied) range object.
  function toRange(minBound: number | undefined, maxBound: number | undefined): RangeFilterValue {
    const result: RangeFilterValue = {};
    if (minBound !== undefined) {
      result.min = minBound;
    }
    if (maxBound !== undefined) {
      result.max = maxBound;
    }
    return result;
  }

  function handleMinChange(event: Event) {
    store.setDraft(column, toRange(parseInput(event), maxValue));
  }

  function handleMaxChange(event: Event) {
    store.setDraft(column, toRange(minValue, parseInput(event)));
  }

  // Applies on blur of either input.
  function handleBlur() {
    store.apply(column);
  }
</script>

<div class="range-slider">
  <input
    type="number"
    class="range-input"
    {min}
    {max}
    value={minValue ?? ''}
    oninput={handleMinChange}
    onblur={handleBlur}
    placeholder="Min"
  />
  <span class="range-separator">-</span>
  <input
    type="number"
    class="range-input"
    {min}
    {max}
    value={maxValue ?? ''}
    oninput={handleMaxChange}
    onblur={handleBlur}
    placeholder="Max"
  />
</div>
