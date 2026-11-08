import type { JSX } from 'solid-js';
import './Button.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  /** Extra class appended after the Button's own classes */
  class?: string;
  /** Id of a popover this button opens and closes (the native popovertarget) */
  popoverTarget?: string;
  onClick?: (event: MouseEvent) => void;
  children: JSX.Element;
}

export default function Button(props: ButtonProps) {
  const handleClick = (event: MouseEvent) => {
    if (!props.disabled && props.onClick) {
      props.onClick(event);
    }
  };

  return (
    <button
      class={`aff-button variant-${props.variant ?? 'secondary'} size-${props.size ?? 'md'}${props.class ? ` ${props.class}` : ''}`}
      type={props.type ?? 'button'}
      disabled={props.disabled ?? false}
      popovertarget={props.popoverTarget}
      onClick={handleClick}
    >
      {props.children}
    </button>
  );
}
