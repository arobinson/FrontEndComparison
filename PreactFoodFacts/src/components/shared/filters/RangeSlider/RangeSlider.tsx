import type { TargetedEvent } from 'preact';
import { useFilterActions, useFilterDraft, type RangeValue } from '../filterStore';
import './RangeSlider.css';

interface RangeSliderProps {
  column: string;
  min?: number;
  max?: number;
}

export const RangeSlider = ({ column, min = 0, max = 100 }: RangeSliderProps) => {
  const range = useFilterDraft<RangeValue>(column);
  const { setDraft, apply } = useFilterActions();
  const minValue = range?.min;
  const maxValue = range?.max;

  const toNumber = (raw: string): number | undefined => (raw === '' ? undefined : Number(raw));

  const handleMinChange = (event: TargetedEvent<HTMLInputElement>) => {
    setDraft(column, { min: toNumber(event.currentTarget.value), max: maxValue });
  };

  const handleMaxChange = (event: TargetedEvent<HTMLInputElement>) => {
    setDraft(column, { min: minValue, max: toNumber(event.currentTarget.value) });
  };

  // The store only keeps the bounds that are set when applying.
  const handleBlur = () => {
    apply(column);
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
