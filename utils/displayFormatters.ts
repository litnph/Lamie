const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const dateTimePartsFormatter = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const parseMoney = (value: number | string): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const compact = value.trim().replace(/[^\d-]/g, '');
  if (!compact || !/^-?\d+$/.test(compact)) return null;
  const numericValue = Number(compact);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const dateParts = (value: string | number | Date) => {
  const dateOnly = typeof value === 'string' ? value.match(/^(\d{4})-(\d{2})-(\d{2})$/) : null;
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]), 12)
    : value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Object.fromEntries(
    dateTimePartsFormatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  ) as Record<'year' | 'month' | 'day' | 'hour' | 'minute', string>;
};

export const formatVndCurrency = (value: number | string): string => {
  const numericValue = parseMoney(value);
  return numericValue == null ? String(value) : vndFormatter.format(Math.round(numericValue));
};

export const formatDisplayDate = (value: string | number | Date): string => {
  const parts = dateParts(value);
  return parts ? `${parts.day}/${parts.month}/${parts.year}` : String(value);
};

export const formatDisplayDateTime = (value: string | number | Date): string => {
  const parts = dateParts(value);
  return parts ? `${parts.hour}:${parts.minute} ${parts.day}/${parts.month}/${parts.year}` : String(value);
};
