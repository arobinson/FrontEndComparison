import { useFilterStore, type RangeFilter } from './filterStore';
import './RangeSlider.css';

interface RangeSliderProps {
  column: string;
  min?: number;
  max?: number;
}

const parseInput = (event: Event): number | undefined => {
  const value = (event.currentTarget as HTMLInputElement).value;
  return value === '' ? undefined : Number(value);
};

// Only bounds that are set end up in the (applied) range object.
const toRange = (minValue: number | undefined, maxValue: number | undefined): RangeFilter => {
  const result: RangeFilter = {};
  if (minValue !== undefined) {
    result.min = minValue;
  }
  if (maxValue !== undefined) {
    result.max = maxValue;
  }
  return result;
};

export default function RangeSlider(props: RangeSliderProps) {
  const store = useFilterStore();

  const draft = () => store.state.draft[props.column] as RangeFilter | undefined;
  const minValue = () => draft()?.min;
  const maxValue = () => draft()?.max;

  // Typing only updates the draft; the range is applied when either input loses focus.
  const handleMinChange = (event: Event) => store.setDraft(props.column, toRange(parseInput(event), maxValue()));
  const handleMaxChange = (event: Event) => store.setDraft(props.column, toRange(minValue(), parseInput(event)));
  const handleBlur = () => store.apply(props.column);

  return (
    <div class="range-slider">
      <input
        type="number"
        class="range-input"
        min={props.min ?? 0}
        max={props.max ?? 100}
        value={minValue() ?? ''}
        onInput={handleMinChange}
        onBlur={handleBlur}
        placeholder="Min"
      />
      <span class="range-separator">-</span>
      <input
        type="number"
        class="range-input"
        min={props.min ?? 0}
        max={props.max ?? 100}
        value={maxValue() ?? ''}
        onInput={handleMaxChange}
        onBlur={handleBlur}
        placeholder="Max"
      />
    </div>
  );
}
