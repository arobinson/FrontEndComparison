import { type ReactNode, type MouseEvent } from 'react';
import './Button.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Id of a popover this button opens and closes (the native popovertarget) */
  popoverTarget?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

export function Button({
  type = 'button',
  disabled = false,
  variant = 'secondary',
  size = 'md',
  className,
  popoverTarget,
  onClick,
  children,
}: ButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
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
}
