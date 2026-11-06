import type { TargetedEvent } from 'preact';
import './RangeSlider.css';

export interface RangeValue {
  min?: number;
  max?: number;
}

interface RangeSliderProps {
  value: RangeValue;
  /** Bounds for the inputs' min/max attributes. */
  min?: number;
  max?: number;
  /** Every keystroke in either input, with the new range. */
  onValueChange: (value: RangeValue) => void;
  /** Blur of either input: the user is done editing. */
  onCommit: () => void;
}

const toNumber = (raw: string): number | undefined => (raw === '' ? undefined : Number(raw));

// Only bounds that are set end up in the range object (empty input = bound absent).
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

export const RangeSlider = ({ value, min = 0, max = 100, onValueChange, onCommit }: RangeSliderProps) => {
  const minValue = value.min;
  const maxValue = value.max;

  const handleMinChange = (event: TargetedEvent<HTMLInputElement>) => {
    onValueChange(toRange(toNumber(event.currentTarget.value), maxValue));
  };

  const handleMaxChange = (event: TargetedEvent<HTMLInputElement>) => {
    onValueChange(toRange(minValue, toNumber(event.currentTarget.value)));
  };

  // onInput = React's onChange for inputs (fires on every keystroke).
  return (
    <div className="range-slider">
      <input
        type="number"
        className="range-input"
        min={min}
        max={max}
        value={minValue ?? ''}
        onInput={handleMinChange}
        onBlur={onCommit}
        placeholder="Min"
      />
      <span className="range-separator">-</span>
      <input
        type="number"
        className="range-input"
        min={min}
        max={max}
        value={maxValue ?? ''}
        onInput={handleMaxChange}
        onBlur={onCommit}
        placeholder="Max"
      />
    </div>
  );
};
