import { createMemo, Show } from 'solid-js';
import Button from '../controls/Button';
import './TruncatedText.css';

interface TruncatedTextProps {
  value: string;
  maxLength?: number;
  /** Controlled: the parent owns the expanded state */
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export default function TruncatedText(props: TruncatedTextProps) {
  const maxLength = () => props.maxLength ?? 50;

  const shouldTruncate = createMemo(() => (props.value?.length ?? 0) > maxLength());

  const displayText = createMemo(() => {
    const text = props.value || '';
    if (shouldTruncate() && !props.expanded) {
      return text.substring(0, maxLength() - 3) + '...';
    }
    return text;
  });

  return (
    <div class="truncated-text">
      <span class="text-content">{displayText()}</span>
      <Show when={shouldTruncate()}>
        <Button variant="tertiary" size="sm" class="toggle-button" onClick={() => props.onExpandedChange(!props.expanded)}>
          {props.expanded ? 'Show less' : 'Show more'}
        </Button>
      </Show>
    </div>
  );
}
