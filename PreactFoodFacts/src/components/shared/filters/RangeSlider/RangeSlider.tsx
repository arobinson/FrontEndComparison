import type { TargetedEvent } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import './RangeSlider.css';

interface RangeValue {
  min?: number;
  max?: number;
}

interface RangeSliderProps {
  min?: number;
  max?: number;
  resetTrigger?: number;
  onValueChange: (value: RangeValue) => void;
}

// Plain component: the React version's memo never bails out, because the
// parent passes a fresh inline `onValueChange` closure on every render.
export const RangeSlider = ({
  min = 0,
  max = 100,
  resetTrigger = 0,
  onValueChange,
}: RangeSliderProps) => {
  const [minValue, setMinValue] = useState<number | undefined>(undefined);
  const [maxValue, setMaxValue] = useState<number | undefined>(undefined);

  useEffect(() => {
    setMinValue(undefined);
    setMaxValue(undefined);
  }, [resetTrigger]);

  const handleMinChange = useCallback((event: TargetedEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value === '' ? undefined : Number(event.currentTarget.value);
    setMinValue(value);
  }, []);

  const handleMaxChange = useCallback((event: TargetedEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value === '' ? undefined : Number(event.currentTarget.value);
    setMaxValue(value);
  }, []);

  const handleBlur = useCallback(() => {
    const result: RangeValue = {};
    if (minValue !== undefined) {
      result.min = minValue;
    }
    if (maxValue !== undefined) {
      result.max = maxValue;
    }
    onValueChange(result);
  }, [minValue, maxValue, onValueChange]);

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
        onBlur={handleBlur}
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
        onBlur={handleBlur}
        placeholder="Max"
      />
    </div>
  );
};
