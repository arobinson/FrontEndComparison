import { memo, useState, useEffect, useCallback, type ChangeEvent } from 'react';
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

export const RangeSlider = memo(({
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

  const handleMinChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? undefined : Number(event.target.value);
    setMinValue(value);
  }, []);

  const handleMaxChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? undefined : Number(event.target.value);
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

  return (
    <div className="range-slider">
      <input
        type="number"
        className="range-input"
        min={min}
        max={max}
        value={minValue ?? ''}
        onChange={handleMinChange}
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
        onChange={handleMaxChange}
        onBlur={handleBlur}
        placeholder="Max"
      />
    </div>
  );
});

RangeSlider.displayName = 'RangeSlider';
