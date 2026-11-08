import { Link } from 'react-router';

import './ProductLink.css';

interface ProductLinkProps {
  code: string;
  label: string;
}

export function ProductLink({ code, label }: ProductLinkProps) {
  return (
    <Link to={`/detail/${code}`} className="product-link">
      {label}
    </Link>
  );
}
