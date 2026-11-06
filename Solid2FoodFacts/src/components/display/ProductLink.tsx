import { paths } from '../../router';
import './ProductLink.css';

interface ProductLinkProps {
  code: string;
  label: string;
}

// A plain <a> (router 2.x has no link component): the router intercepts same-origin clicks.
// The typed `paths` node includes the router base.
export default function ProductLink(props: ProductLinkProps) {
  return (
    <a href={String(paths.detail(props.code))} class="product-link">
      {props.label}
    </a>
  );
}
