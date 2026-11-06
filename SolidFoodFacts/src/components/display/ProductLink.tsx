import { A } from '@solidjs/router';
import './ProductLink.css';

interface ProductLinkProps {
  code: string;
  label: string;
}

// The router's link component, like React's <Link>. Empty activeClass/inactiveClass keep the
// rendered class to just "product-link" (Solid's classList skips empty keys).
export default function ProductLink(props: ProductLinkProps) {
  return (
    <A href={`/detail/${props.code}`} class="product-link" activeClass="" inactiveClass="">
      {props.label}
    </A>
  );
}
