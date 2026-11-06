import type { ComponentChildren, TargetedMouseEvent } from 'preact';
import { memo } from '../../../utils/memo';
import './Button.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Id of a popover this button opens and closes (the native popovertarget) */
  popoverTarget?: string;
  onClick?: (event: TargetedMouseEvent<HTMLButtonElement>) => void;
  children: ComponentChildren;
}

export const Button = memo(({
  type = 'button',
  disabled = false,
  variant = 'secondary',
  size = 'md',
  className,
  popoverTarget,
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
      className={`aff-button variant-${variant} size-${size}${className ? ` ${className}` : ''}`}
      type={type}
      disabled={disabled}
      popoverTarget={popoverTarget}
      onClick={handleClick}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
