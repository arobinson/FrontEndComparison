import { useState, useCallback } from 'preact/hooks';
import { memo } from '../../utils/memo';
import './ProductImage.css';

interface ProductImageProps {
  value: string;
  size?: 'small' | 'large';
}

export const ProductImage = memo(function ProductImage({ value, size = 'small' }: ProductImageProps) {
  // Load/error state belongs to the URL it happened for, so a new URL starts out not loaded
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageLoaded = loadedSrc === value;
  const imageError = failedSrc === value;

  const onImageLoad = useCallback(() => {
    setLoadedSrc(value);
  }, [value]);

  const onImageError = useCallback(() => {
    setFailedSrc(value);
  }, [value]);

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
