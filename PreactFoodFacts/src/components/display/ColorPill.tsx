import { memo } from '../../utils/memo';
import './ColorPill.css';

interface ColorPillProps {
  value: string;
}

export const ColorPill = memo(function ColorPill({ value }: ColorPillProps) {
  return (
    <span
      className="color-pill"
      style={{ backgroundColor: value }}
      title={value}
    />
  );
});
