<script lang="ts">
  let { value }: { value: string } = $props();

  let formattedTime = $derived.by(() => {
    if (!value) {
      return '';
    }
    const [hours, minutes] = value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  });
</script>

{formattedTime}
