import { A } from '@solidjs/router';
import './ProductLink.css';

interface ProductLinkProps {
  value: string | number;
}

export default function ProductLink(props: ProductLinkProps) {
  return (
    <A href={`/detail/${props.value}`} class="product-link">
      {props.value}
    </A>
  );
}
