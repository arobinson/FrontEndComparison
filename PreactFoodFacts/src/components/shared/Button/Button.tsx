import type { ComponentChildren, TargetedMouseEvent } from 'preact';
import { memo } from '../../../utils/memo';
import './Button.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (event: TargetedMouseEvent<HTMLButtonElement>) => void;
  children: ComponentChildren;
}

export const Button = memo(({
  type = 'button',
  disabled = false,
  variant = 'secondary',
  size = 'md',
  onClick,
  children,
}: ButtonProps) => {
  const handleClick = (event: TargetedMouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      className={`aff-button variant-${variant} size-${size}`}
      type={type}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
