import { createMemo, For } from 'solid-js';
import './NovaDots.css';

interface NovaDotsProps {
  value: number;
}

export default function NovaDots(props: NovaDotsProps) {
  const rating = createMemo(() => {
    if (props.value < 1) return 1;
    if (props.value > 4) return 4;
    return Math.floor(props.value);
  });

  const dots = createMemo(() => {
    const filledCount = rating();
    const result = [];
    for (let i = 1; i <= 4; i++) {
      result.push({ filled: i <= filledCount });
    }
    return result;
  });

  return (
    <div class="nova-dots">
      <For each={dots()}>
        {(dot) => <span class={`dot ${dot.filled ? 'filled' : ''}`}></span>}
      </For>
    </div>
  );
}
