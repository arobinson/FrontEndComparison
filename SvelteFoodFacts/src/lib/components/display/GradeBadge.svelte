<script lang="ts">
  let { value }: { value: string } = $props();

  let gradeClass = $derived(() => {
    switch (value?.toUpperCase()) {
      case 'A': return 'grade-a';
      case 'B': return 'grade-b';
      case 'C': return 'grade-c';
      case 'D': return 'grade-d';
      case 'F': return 'grade-f';
      default: return 'grade-unknown';
    }
  });
</script>

<span class="grade-badge {gradeClass()}">
  {value}
</span>

<style>
  .grade-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 13px;
    text-align: center;
    min-width: 56px;
    color: white;
    line-height: 1;
  }

  .grade-a {
    background-color: #4caf50;
  }

  .grade-b {
    background-color: #2196f3;
  }

  .grade-c {
    background-color: #ff9800;
  }

  .grade-d {
    background-color: #f57c00;
  }

  .grade-f {
    background-color: #f44336;
  }

  .grade-unknown {
    background-color: #9e9e9e;
  }
</style>
