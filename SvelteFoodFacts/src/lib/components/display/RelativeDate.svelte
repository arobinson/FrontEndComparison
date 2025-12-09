<script lang="ts">
  let { value }: { value: string } = $props();

  let relativeTime = $derived(() => {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'just now';
    }
    if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  });
</script>

<span class="relative-date">{relativeTime()}</span>

<style>
  .relative-date {
    color: #333;
  }
</style>
