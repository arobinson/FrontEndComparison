import './RangeSlider.css';

export type RangeValue = { min?: number; max?: number };

interface RangeSliderProps {
  value: RangeValue;
  /** Bounds for the inputs' min/max attributes */
  min?: number;
  max?: number;
  /** Every keystroke: the new range (only the bounds that are set; an empty input leaves its bound out) */
  onValueChange: (value: RangeValue) => void;
  /** Either input loses focus: the user is done editing */
  onCommit: () => void;
}

const parseInput = (event: Event): number | undefined => {
  const value = (event.currentTarget as HTMLInputElement).value;
  return value === '' ? undefined : Number(value);
};

// Only bounds that are set end up in the range object.
const toRange = (minValue: number | undefined, maxValue: number | undefined): RangeValue => {
  const result: RangeValue = {};
  if (minValue !== undefined) {
    result.min = minValue;
  }
  if (maxValue !== undefined) {
    result.max = maxValue;
  }
  return result;
};

export default function RangeSlider(props: RangeSliderProps) {
  const handleMinChange = (event: Event) => props.onValueChange(toRange(parseInput(event), props.value.max));
  const handleMaxChange = (event: Event) => props.onValueChange(toRange(props.value.min, parseInput(event)));
  const handleBlur = () => props.onCommit();

  return (
    <div class="range-slider">
      <input
        type="number"
        class="range-input"
        min={props.min ?? 0}
        max={props.max ?? 100}
        value={props.value.min ?? ''}
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
        value={props.value.max ?? ''}
        onInput={handleMaxChange}
        onBlur={handleBlur}
        placeholder="Max"
      />
    </div>
  );
}
