<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    disabled = false,
    size = 'md',
    variant = 'primary',
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
    border-radius: 0.375rem;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }

  .btn-md {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  .btn-primary {
    background-color: #3b82f6;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .btn-secondary {
    background-color: #6b7280;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #4b5563;
  }

  .btn-outline {
    background-color: transparent;
    border-color: #d1d5db;
    color: #374151;
  }

  .btn-outline:hover:not(:disabled) {
    background-color: #f3f4f6;
  }
</style>
