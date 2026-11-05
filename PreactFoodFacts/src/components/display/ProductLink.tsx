import { memo } from '../../utils/memo';
import { toPath } from '../../config/routes';
import './ProductLink.css';

interface ProductLinkProps {
  code: string;
  label: string;
}

// Plain <a href>: preact-iso's LocationProvider intercepts same-origin clicks
// and performs a client-side push, producing the same <a href="..."> DOM as
// React Router's <Link>.
export const ProductLink = memo(({ code, label }: ProductLinkProps) => {
  return (
    <a href={toPath(`/detail/${code}`)} className="product-link">
      {label}
    </a>
  );
});

ProductLink.displayName = 'ProductLink';
