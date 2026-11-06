import { useHref, useResolvedPath } from '@solidjs/router';
import './ProductLink.css';

interface ProductLinkProps {
  code: string;
  label: string;
}

// A plain <a>: the router intercepts same-origin link clicks (preloading is off on <Router>).
// useResolvedPath + useHref add the router base, exactly as <A> does.
export default function ProductLink(props: ProductLinkProps) {
  const href = useHref(useResolvedPath(() => `/detail/${props.code}`));
  return (
    <a href={href()} class="product-link">
      {props.label}
    </a>
  );
}
