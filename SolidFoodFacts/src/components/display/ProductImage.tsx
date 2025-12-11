import { createSignal, Show } from 'solid-js';
import './ProductImage.css';

interface ProductImageProps {
  value: string;
  size?: 'small' | 'large';
}

export default function ProductImage(props: ProductImageProps) {
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const [imageError, setImageError] = createSignal(false);

  const size = () => props.size || 'small';

  return (
    <div class={`product-image ${size()}`}>
      <Show
        when={!imageError()}
        fallback={<div class="image-placeholder">No image</div>}
      >
        <img
          src={props.value}
          alt="Product image"
          class={imageLoaded() ? 'loaded' : ''}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      </Show>
    </div>
  );
}
