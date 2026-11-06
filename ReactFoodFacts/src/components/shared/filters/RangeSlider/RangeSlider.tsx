import { memo, useCallback, type ChangeEvent } from 'react';
import { useFilterDraft, useFilterDispatch, type RangeValue } from '../filterStore';
import './RangeSlider.css';

interface RangeSliderProps {
  column: string;
  min?: number;
  max?: number;
}

const parseInput = (event: ChangeEvent<HTMLInputElement>): number | undefined =>
  event.target.value === '' ? undefined : Number(event.target.value);

// Only bounds that are set end up in the (applied) range object.
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
  column,
  min = 0,
  max = 100,
}: RangeSliderProps) => {
  const draft = useFilterDraft<RangeValue>(column);
  const dispatch = useFilterDispatch();
  const minValue = draft?.min;
  const maxValue = draft?.max;

  const handleMinChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setDraft', column, value: toRange(parseInput(event), maxValue) });
  }, [dispatch, column, maxValue]);

  const handleMaxChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setDraft', column, value: toRange(minValue, parseInput(event)) });
  }, [dispatch, column, minValue]);

  const handleBlur = useCallback(() => {
    dispatch({ type: 'apply', column });
  }, [dispatch, column]);

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
