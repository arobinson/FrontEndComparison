import './ColorPill.css';

interface ColorPillProps {
  value: string;
}

export function ColorPill({ value }: ColorPillProps) {
  return (
    <span
      className="color-pill"
      style={{ backgroundColor: value }}
      title={value}
    />
  );
}
