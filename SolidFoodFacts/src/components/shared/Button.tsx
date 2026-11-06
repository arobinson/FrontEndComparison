import type { JSX } from 'solid-js';
import './Button.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
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
      class={`aff-button variant-${props.variant ?? 'secondary'} size-${props.size ?? 'md'}`}
      type={props.type ?? 'button'}
      disabled={props.disabled ?? false}
      onClick={handleClick}
    >
      {props.children}
    </button>
  );
}
