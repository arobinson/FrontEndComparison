import { createSignal, Show } from 'solid-js';
import './ProductImage.css';

interface ProductImageProps {
  value: string;
  size?: 'small' | 'large';
}

export default function ProductImage(props: ProductImageProps) {
  // Load/error state belongs to the URL it happened for, so a new URL starts out not loaded
  const [loadedSrc, setLoadedSrc] = createSignal<string | null>(null);
  const [failedSrc, setFailedSrc] = createSignal<string | null>(null);
  const imageLoaded = () => loadedSrc() === props.value;
  const imageError = () => failedSrc() === props.value;

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
          onLoad={() => setLoadedSrc(props.value)}
          onError={() => setFailedSrc(props.value)}
        />
      </Show>
    </div>
  );
}
