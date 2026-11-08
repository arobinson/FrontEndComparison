interface TimeFormatProps {
  value: string | null | undefined;
}

function formatTime(value: string | null | undefined) {
  let result: string;
  if (!value) {
    result = '';
  } else {
    const [hours, minutes] = value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    result = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }
  return result;
}

export function TimeFormat({ value }: TimeFormatProps) {
  const formatted = formatTime(value);

  return <>{formatted}</>;
}
