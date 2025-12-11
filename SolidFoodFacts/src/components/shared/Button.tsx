import type { JSX } from 'solid-js';
import './Button.css';

interface ButtonProps {
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  children: JSX.Element;
}

export default function Button(props: ButtonProps) {
  const size = () => props.size || 'md';
  const variant = () => props.variant || 'secondary';

  return (
    <button
      type="button"
      class={`btn btn-${size()} btn-${variant()}`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
