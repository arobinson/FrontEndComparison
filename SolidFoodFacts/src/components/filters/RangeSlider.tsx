import { createSignal, createEffect } from 'solid-js';
import './RangeSlider.css';

interface RangeSliderProps {
  min?: number;
  max?: number;
  resetTrigger?: number;
  onValueChange?: (value: { min: number; max: number }) => void;
}

export default function RangeSlider(props: RangeSliderProps) {
  const min = () => props.min ?? 0;
  const max = () => props.max ?? 100;

  const [minValue, setMinValue] = createSignal(min());
  const [maxValue, setMaxValue] = createSignal(max());

  // Reset when trigger changes
  createEffect(() => {
    if (props.resetTrigger) {
      setMinValue(min());
      setMaxValue(max());
    }
  });

  function handleMinChange(event: Event) {
    const target = event.target as HTMLInputElement;
    let newMin = Number(target.value);
    if (newMin > maxValue()) newMin = maxValue();
    setMinValue(newMin);
    props.onValueChange?.({ min: newMin, max: maxValue() });
  }

  function handleMaxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    let newMax = Number(target.value);
    if (newMax < minValue()) newMax = minValue();
    setMaxValue(newMax);
    props.onValueChange?.({ min: minValue(), max: newMax });
  }

  return (
    <div class="range-slider">
      <input
        type="number"
        class="range-input"
        value={minValue()}
        min={min()}
        max={maxValue()}
        onInput={handleMinChange}
      />
      <span class="separator">-</span>
      <input
        type="number"
        class="range-input"
        value={maxValue()}
        min={minValue()}
        max={max()}
        onInput={handleMaxChange}
      />
    </div>
  );
}
