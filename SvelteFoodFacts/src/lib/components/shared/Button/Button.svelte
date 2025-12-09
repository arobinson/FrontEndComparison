<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    disabled = false,
    size = 'md',
    variant = 'secondary',
    onclick,
    children,
  }: {
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary' | 'outline';
    onclick?: () => void;
    children: Snippet;
  } = $props();
</script>

<button
  type="button"
  class="btn btn-{size} btn-{variant}"
  {disabled}
  {onclick}
>
  {@render children()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    background: #fff;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
    line-height: 1;
  }

  .btn:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .btn-sm {
    padding: 4px 8px;
    font-size: 14px;
    min-height: 28px;
  }

  .btn-md {
    padding: 8px 12px;
    font-size: 16px;
    min-height: 36px;
  }

  .btn-lg {
    padding: 12px 16px;
    font-size: 18px;
    min-height: 44px;
  }

  .btn-primary {
    background: #007bff;
    color: #fff;
    border-color: #007bff;
  }

  .btn-primary:hover:not(:disabled) {
    background: #0056b3;
    border-color: #0056b3;
  }

  .btn-secondary {
    background: #fff;
    color: #333;
    border-color: #e0e0e0;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #007bff;
  }

  .btn-outline {
    background: transparent;
    color: #007bff;
    border: none;
  }

  .btn-outline:hover:not(:disabled) {
    background: #f8f9fa;
  }
</style>
