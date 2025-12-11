import { createSignal, createMemo, Show } from 'solid-js';
import './TruncatedText.css';

interface TruncatedTextProps {
  value: string;
  maxLength?: number;
}

export default function TruncatedText(props: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const maxLength = () => props.maxLength ?? 50;

  const shouldTruncate = createMemo(() => (props.value?.length ?? 0) > maxLength());

  const displayText = createMemo(() => {
    const text = props.value || '';
    if (shouldTruncate() && !isExpanded()) {
      return text.substring(0, maxLength() - 3) + '...';
    }
    return text;
  });

  return (
    <div class="truncated-text">
      <span class="text-content">{displayText()}</span>
      <Show when={shouldTruncate()}>
        <button
          class="toggle-button"
          onClick={() => setIsExpanded(!isExpanded())}
          type="button"
        >
          {isExpanded() ? 'Show less' : 'Show more'}
        </button>
      </Show>
    </div>
  );
}
