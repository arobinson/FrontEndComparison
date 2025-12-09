import { memo } from 'react';
import './ColorPill.css';

interface ColorPillProps {
  value: string;
}

export const ColorPill = memo(({ value }: ColorPillProps) => {
  return (
    <span
      className="color-pill"
      style={{ backgroundColor: value }}
      title={value}
    />
  );
});

ColorPill.displayName = 'ColorPill';
