import { memo, useCallback, type ChangeEvent } from 'react';
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

const parseInput = (event: ChangeEvent<HTMLInputElement>): number | undefined =>
  event.target.value === '' ? undefined : Number(event.target.value);

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

export const RangeSlider = memo(({
  value,
  min = 0,
  max = 100,
  onValueChange,
  onCommit,
}: RangeSliderProps) => {
  const minValue = value.min;
  const maxValue = value.max;

  const handleMinChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(toRange(parseInput(event), maxValue));
  }, [onValueChange, maxValue]);

  const handleMaxChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(toRange(minValue, parseInput(event)));
  }, [onValueChange, minValue]);

  return (
    <div className="range-slider">
      <input
        type="number"
        className="range-input"
        min={min}
        max={max}
        value={minValue ?? ''}
        onChange={handleMinChange}
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
        onChange={handleMaxChange}
        onBlur={onCommit}
        placeholder="Max"
      />
    </div>
  );
});

RangeSlider.displayName = 'RangeSlider';
