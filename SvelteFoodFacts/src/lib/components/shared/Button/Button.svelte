<script lang="ts">
  import type { Snippet } from 'svelte';
  import './Button.css';

  let {
    type = 'button',
    disabled = false,
    variant = 'secondary',
    size = 'md',
    onclick,
    children,
  }: {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'sm' | 'md' | 'lg';
    onclick?: (event: MouseEvent) => void;
    children: Snippet;
  } = $props();

  function handleClick(event: MouseEvent) {
    if (!disabled && onclick) {
      onclick(event);
    }
  }
</script>

<button
  class="aff-button variant-{variant} size-{size}"
  {type}
  {disabled}
  onclick={handleClick}
>
  {@render children()}
</button>
