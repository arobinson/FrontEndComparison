import { memo, type ReactNode, type MouseEvent } from 'react';
import './Button.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

export const Button = memo(({
  type = 'button',
  disabled = false,
  variant = 'secondary',
  size = 'md',
  onClick,
  children,
}: ButtonProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
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
