import { createSignal, createMemo, Show } from 'solid-js';
import Button from '../controls/Button';
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
        <Button variant="tertiary" size="sm" class="toggle-button" onClick={() => setIsExpanded(!isExpanded())}>
          {isExpanded() ? 'Show less' : 'Show more'}
        </Button>
      </Show>
    </div>
  );
}
