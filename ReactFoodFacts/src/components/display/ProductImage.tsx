import { memo, useState, useCallback } from 'react';

interface ProductImageProps {
  url: string | null | undefined;
  alt: string;
  size?: 'thumbnail' | 'small' | 'medium';
}

export const ProductImage = memo(({ url, alt, size = 'thumbnail' }: ProductImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  let content;
  if (!url || hasError) {
    content = <span className="product-image-fallback">No image</span>;
  } else {
    content = (
      <>
        {isLoading && <span className="product-image-loading">Loading...</span>}
        <img
          src={url}
          alt={alt}
          className={`product-image product-image-${size}`}
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </>
    );
  }

  return <div className="product-image-container">{content}</div>;
});

ProductImage.displayName = 'ProductImage';
