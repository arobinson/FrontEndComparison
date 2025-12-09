<script lang="ts">
  let { value }: { value: number } = $props();

  let percentage = $derived(() => {
    if (value < 0) return 0;
    if (value > 100) return 100;
    return value;
  });

  let colorClass = $derived(() => {
    const pct = percentage();
    if (pct >= 70) return 'high';
    if (pct >= 40) return 'medium';
    return 'low';
  });
</script>

<div class="progress-bar-container">
  <div class="progress-bar {colorClass()}">
    <div class="progress-fill" style:width="{percentage()}%"></div>
  </div>
  <span class="progress-text">{percentage()}%</span>
</div>

<style>
  .progress-bar-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .progress-bar {
    flex: 1;
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    min-width: 60px;
  }

  .progress-fill {
    height: 100%;
    transition: width 0.3s ease, background-color 0.3s ease;
    border-radius: 10px;
  }

  .progress-bar.high .progress-fill {
    background-color: #4caf50;
  }

  .progress-bar.medium .progress-fill {
    background-color: #ff9800;
  }

  .progress-bar.low .progress-fill {
    background-color: #f44336;
  }

  .progress-text {
    font-size: 12px;
    font-weight: 500;
    min-width: 35px;
    text-align: right;
    color: #666;
  }
</style>
