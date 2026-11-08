interface AbsoluteDateProps {
  value: string | null | undefined;
}

function formatDate(value: string | null | undefined) {
  let result: string;
  if (!value) {
    result = '';
  } else {
    const date = new Date(value);
    result = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  return result;
}

export function AbsoluteDate({ value }: AbsoluteDateProps) {
  const formattedDate = formatDate(value);

  return <span className="absolute-date">{formattedDate}</span>;
}
