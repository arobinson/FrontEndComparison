<script lang="ts">
  let { value, maxStars = 5 }: { value: number; maxStars?: number } = $props();

  let stars = $derived(() => {
    const rating = Number(value) || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    return {
      full: Array(fullStars).fill(0),
      half: hasHalfStar ? [0] : [],
      empty: Array(Math.max(0, emptyStars)).fill(0),
    };
  });
</script>

<div class="star-rating">
  {#each stars().full, i (i)}
    <span class="star full">★</span>
  {/each}
  {#each stars().half, i (i)}
    <span class="star half">★</span>
  {/each}
  {#each stars().empty, i (i)}
    <span class="star empty">☆</span>
  {/each}
  <span class="rating-value">{value}</span>
</div>

<style>
  .star-rating {
    display: flex;
    align-items: center;
    gap: 0.125rem;
  }

  .star {
    font-size: 1.25rem;
    line-height: 1;
  }

  .star.full {
    color: #ffc107;
  }

  .star.half {
    color: #ffc107;
    position: relative;
  }

  .star.half::after {
    content: "☆";
    position: absolute;
    left: 0;
    color: #e0e0e0;
    clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
  }

  .star.empty {
    color: #e0e0e0;
  }

  .rating-value {
    margin-left: 0.5rem;
    font-size: 0.875rem;
    color: #6c757d;
    font-weight: 500;
  }
</style>
