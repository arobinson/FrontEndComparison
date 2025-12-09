import { Link } from 'react-router-dom';
import { memo } from 'react';
import './ProductLink.css';

interface ProductLinkProps {
  code: string;
  label: string;
}

export const ProductLink = memo(({ code, label }: ProductLinkProps) => {
  return (
    <Link to={`/detail/${code}`} className="product-link">
      {label}
    </Link>
  );
});

ProductLink.displayName = 'ProductLink';
