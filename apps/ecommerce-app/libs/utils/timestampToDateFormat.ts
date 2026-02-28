import { format, FormatOptions, isValid } from 'date-fns';

export const formatDate = (
  value?: string | null,
  formatStr?: string,
  opts?: FormatOptions,
) => {
  if (!value) return '';

  const numeric = Number(value);
  const date =
    Number.isNaN(numeric) || value.trim() === ''
      ? new Date(value)
      : new Date(value.length === 10 ? numeric * 1000 : numeric);

  if (!isValid(date)) return '';

  return format(date, formatStr || 'MMM dd, yyyy hh:mm a', opts);
};
