<script lang="ts">
  import type { Snippet } from 'svelte';
  import './Button.css';

  let {
    type = 'button',
    disabled = false,
    variant = 'secondary',
    size = 'md',
    onclick,
    class: extraClass,
    children,
  }: {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'sm' | 'md' | 'lg';
    onclick?: (event: MouseEvent) => void;
    class?: string;
    children: Snippet;
  } = $props();

  const classes = $derived(
    `aff-button variant-${variant} size-${size}` + (extraClass ? ` ${extraClass}` : '')
  );

  function handleClick(event: MouseEvent) {
    if (!disabled && onclick) {
      onclick(event);
    }
  }
</script>

<button
  class={classes}
  {type}
  {disabled}
  onclick={handleClick}
>
  {@render children()}
</button>
