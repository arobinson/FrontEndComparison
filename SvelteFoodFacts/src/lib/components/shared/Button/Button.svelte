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
    popoverTarget,
    children,
  }: {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'sm' | 'md' | 'lg';
    onclick?: (event: MouseEvent) => void;
    class?: string;
    /** Id of a popover this button opens and closes (the native popovertarget) */
    popoverTarget?: string;
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
  popovertarget={popoverTarget}
  onclick={handleClick}
>
  {@render children()}
</button>
