import { memo, useState, useCallback } from 'react';
import './ProductImage.css';

interface ProductImageProps {
  value: string;
  size?: 'small' | 'large';
}

export const ProductImage = memo(({ value, size = 'small' }: ProductImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const onImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const onImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className={`product-image ${size}`}>
      {!imageError ? (
        <img
          src={value}
          alt="Product image"
          onLoad={onImageLoad}
          onError={onImageError}
          className={imageLoaded ? 'loaded' : ''}
        />
      ) : (
        <div className="image-placeholder">No image</div>
      )}
    </div>
  );
});

ProductImage.displayName = 'ProductImage';
