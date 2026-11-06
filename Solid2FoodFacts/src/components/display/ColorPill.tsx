import './ColorPill.css';

interface ColorPillProps {
  value: string;
}

export default function ColorPill(props: ColorPillProps) {
  return (
    <span
      class="color-pill"
      style={{ "background-color": props.value }}
      title={props.value}
    ></span>
  );
}
