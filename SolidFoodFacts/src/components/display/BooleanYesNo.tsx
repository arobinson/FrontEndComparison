import { Show } from 'solid-js';
import './BooleanYesNo.css';

interface BooleanYesNoProps {
  value: boolean | null | undefined;
}

export default function BooleanYesNo(props: BooleanYesNoProps) {
  return (
    <Show when={props.value} fallback={<span class="boolean-yesno no">No</span>}>
      <span class="boolean-yesno yes">Yes</span>
    </Show>
  );
}
